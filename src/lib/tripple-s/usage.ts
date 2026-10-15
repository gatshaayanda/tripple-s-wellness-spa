export type UsageEvent =
  | "page_view"
  | "booking_start"
  | "availability_result"
  | "booking_submit_success"
  | "booking_conflict"
  | "enquiry_submit_success";

type UsagePayload = {
  event: UsageEvent;
  category?: "home" | "treatments" | "treatment_detail" | "products" | "booking" | "account" | "other";
  outcome?: "available" | "empty" | "error";
  firstSession?: boolean;
  source?: "direct" | "search" | "social" | "referral";
  device?: "mobile" | "tablet" | "desktop";
};

function sourceBucket(): NonNullable<UsagePayload["source"]> {
  const referrer = document.referrer;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (/google\.|bing\.|yahoo\.|duckduckgo\./.test(host)) return "search";
    if (/instagram\.|facebook\.|tiktok\.|youtube\.|whatsapp\.|linkedin\./.test(host)) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

function deviceBucket(): NonNullable<UsagePayload["device"]> {
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

function isFirstBrowserDay(): boolean {
  const today = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const key = "tripple-s-usage-counted-" + today;
  try {
    if (localStorage.getItem(key) === "1") return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    const fallback = "tripple-s-usage-counted";
    try {
      if (sessionStorage.getItem(fallback) === today) return false;
      sessionStorage.setItem(fallback, today);
    } catch {}
    return true;
  }
}

/** Coarse aggregate events only: never sends names, contact details, query strings, or clinical information. */
export function trackUsage(event: UsageEvent, extra: Pick<UsagePayload, "category" | "outcome"> = {}) {
  if (typeof window === "undefined") return;
  const payload: UsagePayload = { event, ...extra };
  if (event === "page_view") {
    payload.firstSession = isFirstBrowserDay();
    payload.source = sourceBucket();
    payload.device = deviceBucket();
  }
  void fetch("/api/usage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    cache: "no-store",
  }).catch(() => {
    // Usage telemetry must never block browsing or booking.
  });
}
