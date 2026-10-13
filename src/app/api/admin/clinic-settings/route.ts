import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, requireAdmin } from "@/lib/firebase/admin";
import { defaultClinicSettings, type ClinicSettings, type DayKey } from "@/lib/tripple-s/clinic-settings";

export const dynamic = "force-dynamic";
const days: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function POST(request: NextRequest) {
  if (!await requireAdmin(request)) return NextResponse.json({ error: "Sign in with an authorized staff account." }, { status: 401 });
  let body: Partial<ClinicSettings>;
  try { body = await request.json() as Partial<ClinicSettings>; }
  catch { return NextResponse.json({ error: "Invalid clinic settings." }, { status: 400 }); }

  const settings = {
    openingHours: { ...defaultClinicSettings.openingHours, ...(body.openingHours ?? {}) },
    bookingRules: { ...defaultClinicSettings.bookingRules, ...(body.bookingRules ?? {}) },
    announcement: { ...defaultClinicSettings.announcement, ...(body.announcement ?? {}) },
  };
  settings.openingHours.sunday = { ...settings.openingHours.sunday, open: true, byAppointment: true };
  for (const day of days) {
    const hours = settings.openingHours[day];
    if (!hours || typeof hours.open !== "boolean" || typeof hours.byAppointment !== "boolean" ||
      !timePattern.test(hours.start) || !timePattern.test(hours.end) || (hours.open && hours.end <= hours.start)) {
      return NextResponse.json({ error: "Check the opening and closing times for each day." }, { status: 400 });
    }
  }
  const rules = settings.bookingRules;
  if (![15, 30, 60].includes(Number(rules.slotIntervalMinutes)) ||
    !Number.isInteger(Number(rules.minimumNoticeHours)) || Number(rules.minimumNoticeHours) < 0 || Number(rules.minimumNoticeHours) > 336 ||
    !Number.isInteger(Number(rules.advanceBookingDays)) || Number(rules.advanceBookingDays) < 1 || Number(rules.advanceBookingDays) > 365 ||
    !Number.isInteger(Number(rules.bufferMinutes)) || Number(rules.bufferMinutes) < 0 || Number(rules.bufferMinutes) > 120) {
    return NextResponse.json({ error: "Check slot increments, minimum notice, booking window and buffer settings." }, { status: 400 });
  }
  const announcement = settings.announcement;
  if (typeof announcement.active !== "boolean" || announcement.title.length > 120 || announcement.message.length > 1200 ||
    (announcement.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(announcement.startDate)) ||
    (announcement.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(announcement.endDate)) ||
    (announcement.startDate && announcement.endDate && announcement.endDate < announcement.startDate)) {
    return NextResponse.json({ error: "Check the announcement title, message and dates." }, { status: 400 });
  }
  try {
    await getAdminDb().collection("settings").doc("clinic").set(settings);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Clinic settings could not be saved." }, { status: 500 });
  }
}
