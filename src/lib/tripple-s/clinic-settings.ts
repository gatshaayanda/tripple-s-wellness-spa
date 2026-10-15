export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type DayHours = {
  open: boolean;
  byAppointment: boolean;
  start: string;
  end: string;
};

export type ClinicSettings = {
  openingHours: Record<DayKey, DayHours>;
  bookingRules: { slotIntervalMinutes: number; minimumNoticeHours: number; advanceBookingDays: number; bufferMinutes: number };
  announcement: {
    active: boolean;
    title: string;
    message: string;
    startDate: string;
    endDate: string;
  };
};

export const dayLabels: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const defaultClinicSettings: ClinicSettings = {
  openingHours: {
    monday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    tuesday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    wednesday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    thursday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    friday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    saturday: { open: true, byAppointment: false, start: "08:00", end: "17:00" },
    sunday: { open: true, byAppointment: true, start: "08:00", end: "17:00" },
  },
  bookingRules: { slotIntervalMinutes: 15, minimumNoticeHours: 0, advanceBookingDays: 90, bufferMinutes: 0 },
  announcement: { active: false, title: "", message: "", startDate: "", endDate: "" },
};

export function parseDurationMinutes(value: string | undefined, fallback = 30): number {
  const text = String(value ?? "").toLowerCase();
  const hours = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours)\b/g)).reduce((sum, match) => sum + Number(match[1]) * 60, 0);
  const minutes = Array.from(text.matchAll(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)\b/g)).reduce((sum, match) => sum + Number(match[1]), 0);
  const parsed = hours + minutes || (/^\s*\d+\s*$/.test(text) ? Number(text) : 0);
  return Math.max(15, Math.min(240, Math.round(parsed || fallback)));
}

export function isAnnouncementVisible(settings: ClinicSettings, today = new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 10)) {
  const announcement = settings.announcement;
  return announcement.active && !!announcement.message.trim()
    && (!announcement.startDate || announcement.startDate <= today)
    && (!announcement.endDate || announcement.endDate >= today);
}
