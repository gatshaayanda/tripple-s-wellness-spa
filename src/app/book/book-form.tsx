"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getIdToken, signInAnonymously } from "firebase/auth";
import { auth, hasFirebaseWebConfig } from "@/lib/firebase/client";
import type { FormEvent } from "react";
import { getClinicSettings, getPublicServices, type ServiceRecord } from "@/lib/firebase/data";
import { defaultClinicSettings, dayLabels, isAnnouncementVisible, type ClinicSettings, type DayKey } from "@/lib/tripple-s/clinic-settings";

const whatsapp = "https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%27d%20like%20to%20enquire.";
function localDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function BookForm() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service") ?? "";
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(defaultClinicSettings);
  const [preferredDate, setPreferredDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityNote, setAvailabilityNote] = useState("");
  const [availabilityRetry, setAvailabilityRetry] = useState(0);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [clientType, setClientType] = useState<"NEW" | "RETURNING">("NEW");
  const [serviceId, setServiceId] = useState(requestedService);
  const minDate = localDateValue();

  useEffect(() => {
    void Promise.all([getPublicServices(), getClinicSettings()])
      .then(([items, settings]) => { setServices(items.filter((item) => item.active)); setClinicSettings(settings); })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => setServiceId(requestedService), [requestedService]);
  useEffect(() => {
    if (!showTimePicker) return;
    const dialog = document.querySelector<HTMLElement>(".timePickerDialog");
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setShowTimePicker(false); return; }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus?.focus(); };
  }, [showTimePicker]);

  const selected = useMemo(() => services.find((item) => item.id === serviceId), [services, serviceId]);
  const selectedDuration = selected?.duration.match(/\d+/)?.[0] ?? "30";
  const slotGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const time of availableSlots) {
      const hour = time.slice(0, 2);
      (groups[hour] ??= []).push(time);
    }
    return Object.entries(groups).sort(([hourA], [hourB]) => hourA.localeCompare(hourB)).map(([hour, times]) => [hour, times.sort((a, b) => a.localeCompare(b))] as [string, string[]]);
  }, [availableSlots]);

  useEffect(() => {
    setSelectedTime(""); setAvailableSlots([]); setAvailabilityError(""); setAvailabilityNote("");
    if (!preferredDate) return;
    let cancelled = false; setLoadingSlots(true);
    fetch("/api/availability?date=" + encodeURIComponent(preferredDate) + "&duration=" + encodeURIComponent(selectedDuration))
      .then(async response => { const data=await response.json(); if(!response.ok) throw new Error(data.error||"Could not load available times."); return data as {slots:string[];note?:string}; })
      .then(data=>{if(!cancelled){setAvailableSlots(data.slots||[]);setAvailabilityNote(data.note||"");}})
      .catch(error=>{if(!cancelled)setAvailabilityError(error instanceof Error?error.message:"Could not load available times.");})
      .finally(()=>{if(!cancelled)setLoadingSlots(false);});
    return ()=>{cancelled=true;};
  }, [preferredDate, selectedDuration, availabilityRetry]);
  const dayKeys: DayKey[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const selectedDay = preferredDate ? dayKeys[new Date(`${preferredDate}T12:00:00`).getDay()] : null;
  const selectedHours = selectedDay ? clinicSettings.openingHours[selectedDay] : undefined;
  const showAnnouncement = isAnnouncementVisible(clinicSettings);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError("");

    const requestedDate = String(form.get("date") ?? "").trim();
    if (!requestedDate || !selectedTime) { setError("Choose a date and one of the available appointment times."); setBusy(false); return; }
    const requestedDay = dayKeys[new Date(requestedDate + "T12:00:00").getDay()];
    const requestedHours = clinicSettings.openingHours[requestedDay];
    if (!requestedHours?.open || !availableSlots.includes(selectedTime)) { setError("That time is no longer available. Please choose another slot."); setBusy(false); return; }
    const service = services.find((item) => item.id === String(form.get("serviceId") ?? ""));
    const email = String(form.get("email") ?? "").trim();
    const preferredTime = selectedTime;
    const message = String(form.get("message") ?? "").trim();
    const discountCode = String(form.get("discountCode") ?? "").trim();
    const request = {
      createdAt: new Date().toISOString(),
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      serviceNameSnapshot: service?.name || "Consultation / help choosing",
      clientType,
      status: "NEW" as const,
      paymentStatus: "PAYMENT_PENDING" as const,
      ...(email ? { email } : {}),
      ...(service ? { serviceId: service.id, priceSnapshot: service.price, durationSnapshot: service.duration } : {}),
      ...(requestedDate ? { preferredDate: requestedDate } : {}),
      ...(preferredTime ? { preferredTime } : {}),
      ...(message ? { message } : {}),
      ...(discountCode ? { discountCode } : {}),
    };

    if (!request.name || !request.phone) {
      setError("Please enter your name and WhatsApp/mobile number so the team can reply.");
      setBusy(false);
      return;
    }

    try {
      const headers: Record<string,string>={"Content-Type":"application/json"};
      // Anonymous identity is invisible and optional; auth failure must not block guest booking.
      if(hasFirebaseWebConfig){try{const customer=auth.currentUser??(await signInAnonymously(auth)).user;headers.Authorization="Bearer "+await getIdToken(customer);}catch(authError){console.warn("[Tripple S] optional customer session unavailable; continuing as guest",authError);}}
      const response = await fetch("/api/bookings", { method: "POST", headers, body: JSON.stringify({ ...request, time: selectedTime, discountCode }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The appointment request could not be saved.");
      setReference(String(result.reference || result.id).slice(0, 8).toUpperCase());
      setSubmitted(true);
      formElement.reset();
    } catch (err) {
      console.error("[Tripple S] appointment request failed", err);
      setError(err instanceof Error ? err.message : "We could not record your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="bookPage bookPageEditorial">
    <nav className="nav"><div className="container navInner"><Link href="/" className="brand" aria-label="Tripple S Wellness Spa home"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link><div className="navLinks"><Link href="/treatments" className="textLink">Browse treatments & prices</Link><Link href="/account" className="textLink">My Tripple S</Link></div><Link href="/account" className="button buttonLight mobileAccountLink">My account</Link></div></nav>
    {showAnnouncement && <div className="container publicAnnouncement" role="status"><strong>{clinicSettings.announcement.title || "Clinic notice"}</strong><span>{clinicSettings.announcement.message}</span></div>}
    <div className="bookingIntro"><div className="bookingIntroInner"><span className="kicker">Your Tripple S visit</span><h1>A few details. <em>We’ll take it from here.</em></h1><p>Tell us how to reach you and what you have in mind. You can choose a treatment or ask the clinical team to guide you.</p><div className="bookingSteps"><span><b>01</b> Your details</span><span><b>02</b> Your preferences</span><span><b>03</b> We confirm with you</span></div></div></div>
    <div className="formWrap formWrapWide">
      {submitted ? <div className="formCard confirm confirmEditorial"><span className="confirmIcon">✦</span><span className="kicker">Request received</span><h2>Thank you. We’ll be in touch.</h2><p>Your reference is <strong>#{reference}</strong>. Keep it for your records.</p><p>Your request has been recorded. The team will contact you to confirm the appointment and next steps.</p><div className="actions" style={{ justifyContent: "center" }}><Link href="/account?submitted=1" className="button buttonPrimary">Finish setting up My Tripple S →</Link><Link href="/" className="button buttonLight">Back to Tripple S</Link></div></div> :
      <div className="bookingLayout">
        <form className="formCard bookingForm" onSubmit={handleSubmit}>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>01</span><div><h2>How can we reach you?</h2><p>Just the essentials to get your request to the right person.</p></div></div>
            <div className="formGrid">
              <div className="field fieldFull"><label htmlFor="name">Your full name</label><input id="name" name="name" required autoComplete="name" placeholder="e.g. Kopano Gatsha"/></div>
              <div className="field"><label htmlFor="phone">WhatsApp / mobile number</label><input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+267 …"/></div>
              <div className="field"><label htmlFor="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"/></div>
            </div>
          </section>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>02</span><div><h2>What brings you in?</h2><p>We will guide you through securing your Tripple S profile after your request, so your visit history and next steps are easier to find again.</p></div></div>
            <div className="clientChoice" role="group" aria-label="Client type"><button type="button" className={clientType === "NEW" ? "clientChoiceOption active" : "clientChoiceOption"} onClick={() => setClientType("NEW")}><strong>First visit</strong><span>Help me get started</span></button><button type="button" className={clientType === "RETURNING" ? "clientChoiceOption active" : "clientChoiceOption"} onClick={() => setClientType("RETURNING")}><strong>Returning client</strong><span>I’ve visited before</span></button></div>
            <div className="field"><label htmlFor="serviceId">Choose a treatment or consultation</label><select id="serviceId" name="serviceId" value={serviceId} onChange={(event) => setServiceId(event.target.value)}><option value="">{loadingServices ? "Loading the menu…" : "I’m not sure — help me choose"}</option>{services.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.price} · {item.duration}</option>)}</select><small>You can leave this blank. The clinical team can help you decide.</small></div>
            {selected && <div className="selectedTreatment"><div><span className="kicker">Your selection</span><strong>{selected.name}</strong><p>{selected.description}</p></div><div className="selectedTreatmentPrice"><strong>{selected.price}</strong><span>{selected.duration}</span></div>{selected.consultationRequired && <p className="selectedTreatmentNote">Clinical assessment may be required. Suitability is determined by the Tripple S clinical team.</p>}</div>}
          </section>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>03</span><div><h2>When works for you?</h2><p>Choose an available slot. The team will confirm your appointment after reviewing the request.</p></div></div>
            <div className="formGrid"><div className="field"><label htmlFor="date">Appointment date</label><input id="date" name="date" type="date" min={minDate} value={preferredDate} onChange={event=>setPreferredDate(event.target.value)} required/><small>{selectedHours?.open ? (selectedDay ? dayLabels[selectedDay] : "") + " · Operating hours " + selectedHours.start + "–" + selectedHours.end + ". " : selectedDay ? "The clinic is not accepting requests on " + dayLabels[selectedDay] + ". " : ""}Times below are checked against the live calendar.</small></div><div className="field fieldFull"><label>Appointment time</label>{!preferredDate?<p className="slotHint">Choose a date to check available times.</p>:loadingSlots?<p className="slotHint">Checking the live calendar…</p>:availabilityError?<div className="slotError" role="alert"><p>{availabilityError}</p><p>We will not show unverified times as live availability. Your appointment has not been booked.</p><div className="actions"><button type="button" className="button buttonLight" onClick={()=>setAvailabilityRetry(value=>value+1)}>Try checking again</button></div></div>:availableSlots.length===0?<p className="slotHint">{availabilityNote || "No available times were found for this date. Try another day."}</p>:<><p className="slotHint">Times are checked against the live calendar and rechecked when you submit. {availabilityNote ? " " + availabilityNote : ""}</p><div className="timeSelectionSummary"><div><strong>{selectedTime || "Choose a time"}</strong><small>{selectedTime ? "Selected appointment time" : `${availableSlots.length} available times`}</small></div><button type="button" className="button buttonLight" onClick={()=>setShowTimePicker(true)} aria-haspopup="dialog">{selectedTime ? "Change time" : "Choose time"}</button></div>{showTimePicker&&<div className="timePickerBackdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setShowTimePicker(false);}}><section className="timePickerDialog" role="dialog" aria-modal="true" aria-labelledby="time-picker-title" tabIndex={-1}><div className="timePickerHeading"><div><span className="kicker">LIVE AVAILABILITY</span><h3 id="time-picker-title">Choose your time</h3><p>{selectedDay ? dayLabels[selectedDay] : ""} · {selectedHours?.start}–{selectedHours?.end}</p></div><button type="button" className="timePickerClose" aria-label="Close time selector" onClick={()=>setShowTimePicker(false)}>×</button></div><div className="slotHourGroups" aria-label="Available appointment times">{slotGroups.map(([hour, times])=><section className="slotHourGroup" key={hour} aria-labelledby={`slot-hour-${hour}`}><h4 id={`slot-hour-${hour}`}>{hour}:00 hour</h4><div className="slotGrid" role="group" aria-label={`Times starting at ${hour}:00`}>{times.map(time=><button key={time} type="button" className={selectedTime===time?"slotButton selected":"slotButton"} aria-pressed={selectedTime===time} onClick={()=>{setSelectedTime(time);setShowTimePicker(false);}}>{time}</button>)}</div></section>)}</div><p className="slotHint">Choose a time to return to your booking. The calendar is checked again when you submit.</p></section></div>}</>}</div><div className="field"><label htmlFor="discountCode">Offer code <span>(optional)</span></label><input id="discountCode" name="discountCode" autoComplete="off" placeholder="Enter a published offer code"/></div><div className="field fieldFull"><label htmlFor="message">Anything else we should know? <span>(optional)</span></label><textarea id="message" name="message" placeholder="Your goal, preferred timing or a question. Please do not include sensitive medical details here."/></div></div>
          </section>
          {error && <p className="bookingError" role="alert">{error}</p>}
          <button className="button buttonPrimary bookingSubmit" type="submit" disabled={busy}>{busy ? "Sending your request…" : "Send appointment request"} <span aria-hidden="true">→</span></button>
          <p className="bookingPrivacy">Your details are used to respond to this request. Please do not enter sensitive medical information in this form.</p>
        </form>
        <aside className="bookingAside"><div className="bookingAsideImage"><span className="placeholderMonogram">S</span><span className="placeholderLabel">CLINIC PHOTOGRAPHY PLACEHOLDER</span></div><div className="bookingAsideContent"><span className="kicker">A clear next step</span><h3>We’ll confirm with you personally.</h3><ol><li>Your request reaches the Tripple S team.</li><li>The team reviews your preferred treatment and timing.</li><li>You are contacted to confirm the appointment details.</li></ol><p>Sending a request does not confirm a booking or payment.</p><div className="asideContact"><strong>Visit us</strong><span>Plot 943, Kaunda Road, Gaborone</span><span>Hours and appointment-only days are managed by the clinic.</span></div><a href={whatsapp} className="textLink">Need help? Contact the clinic →</a></div></aside>
      </div>}
    </div>
  </main>;
}
