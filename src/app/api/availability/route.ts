import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { defaultClinicSettings, type DayKey } from "@/lib/tripple-s/clinic-settings";
export const dynamic = "force-dynamic";
const days: DayKey[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const clock = (value: number) => String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");
function localDay(date: string) { return days[new Date(date + "T12:00:00+02:00").getUTCDay()]; }
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? "";
  const duration = Math.max(15, Math.min(240, Number(request.nextUrl.searchParams.get("duration") ?? 30) || 30));
  const parsedDate = new Date(date + "T12:00:00+02:00");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return NextResponse.json({ error: "Choose a valid appointment date." }, { status: 400 });
  try {
    const db = getAdminDb();
    const settingsSnap = await db.collection("settings").doc("clinic").get();
    const saved = settingsSnap.data() ?? {};
    const settings = { openingHours: { ...defaultClinicSettings.openingHours, ...(saved.openingHours ?? {}) }, bookingRules: { ...defaultClinicSettings.bookingRules, ...(saved.bookingRules ?? {}) } };
    settings.openingHours.sunday = { ...defaultClinicSettings.openingHours.sunday, ...(saved.openingHours?.sunday ?? {}), open: true, byAppointment: true };
    const dayKey = localDay(date);
    const day = settings.openingHours[dayKey];
    if (!day?.open) return NextResponse.json({ slots: [], note: "The clinic is not accepting requests on this day." });
    const today = new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 10);
    const distance = Math.round((new Date(date + "T00:00:00+02:00").getTime() - new Date(today + "T00:00:00+02:00").getTime()) / 86400000);
    if (distance < 0 || distance > settings.bookingRules.advanceBookingDays) return NextResponse.json({ slots: [], note: "Choose a date within the booking window." });
    const [reservations, appointments, requests] = await Promise.all([db.collection("slotReservations").where("date", "==", date).get(), db.collection("appointments").where("date", "==", date).get(), db.collection("bookingRequests").where("preferredDate", "==", date).get()]);
    const occupied = new Set(reservations.docs.map((item) => String(item.data().time)));
    const events = appointments.docs.map((item) => item.data()).filter((item) => item.status !== "CANCELLED");
    const heldRequests = requests.docs.map((item) => item.data()).filter((item) => item.status !== "CANCELLED" && item.status !== "DECLINED" && item.status !== "RESCHEDULED" && typeof item.preferredTime === "string");
    const interval = Math.max(15, Math.min(60, Number(settings.bookingRules.slotIntervalMinutes) || 15));
    const minimum = Date.now() + Math.max(0, Number(settings.bookingRules.minimumNoticeHours) || 0) * 3600000;
    const buffer = Math.max(0, Number(settings.bookingRules.bufferMinutes) || 0);
    const endLimit = minutes(day.end);
    const slots: string[] = [];
    for (let start = minutes(day.start); start + duration <= endLimit; start += interval) {
      const time = clock(start);
      if (new Date(date + "T" + time + ":00+02:00").getTime() < minimum) continue;
      const busyEnd = start + duration + buffer;
      let blocked = false;
      for (let minute = start; minute < busyEnd; minute += 15) if (occupied.has(clock(minute))) blocked = true;
      for (const event of events) if (typeof event.startTime === "string" && typeof event.endTime === "string" && start < minutes(event.endTime) && busyEnd > minutes(event.startTime)) blocked = true;
      for (const held of heldRequests) { const heldStart=minutes(String(held.preferredTime)); const heldDuration=Number(String(held.durationSnapshot||"30").match(/\d+/)?.[0]||30); if(start<heldStart+heldDuration&&busyEnd>heldStart)blocked=true; }
      if (!blocked) slots.push(time);
    }
    return NextResponse.json({ slots, note: day.byAppointment ? "Appointment-only hours; the clinic will confirm your request." : "" });
  } catch (error) {
    console.error("[Tripple S] availability lookup failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Live availability is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
