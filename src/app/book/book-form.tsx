"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createBookingRequest, getPublicServices, type ServiceRecord } from "@/lib/firebase/data";

const whatsapp = "https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%27d%20like%20to%20enquire.";
function localDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function BookForm() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service") ?? "";
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [clientType, setClientType] = useState<"NEW" | "RETURNING">("NEW");
  const [serviceId, setServiceId] = useState(requestedService);
  const minDate = localDateValue();

  useEffect(() => {
    void getPublicServices()
      .then((items) => setServices(items.filter((item) => item.active)))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => setServiceId(requestedService), [requestedService]);
  const selected = useMemo(() => services.find((item) => item.id === serviceId), [services, serviceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError("");

    const requestedDate = String(form.get("date") ?? "").trim();
    if (requestedDate && requestedDate < minDate) {
      setError("Please choose today or a future date.");
      setBusy(false);
      return;
    }
    const service = services.find((item) => item.id === String(form.get("serviceId") ?? ""));
    const email = String(form.get("email") ?? "").trim();
    const preferredTime = String(form.get("time") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
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
    };

    if (!request.name || !request.phone) {
      setError("Please enter your name and WhatsApp/mobile number so the team can reply.");
      setBusy(false);
      return;
    }

    try {
      const id = await createBookingRequest(request);
      setReference(id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      formElement.reset();
    } catch (err) {
      console.error("[Tripple S] appointment request failed", err);
      setError("We could not record your request right now. Nothing has been confirmed. Please try again or contact the clinic.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="bookPage bookPageEditorial">
    <nav className="nav"><div className="container navInner"><Link href="/" className="brand" aria-label="Tripple S Wellness Spa home"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link><Link href="/treatments" className="textLink">Browse treatments & prices</Link></div></nav>
    <div className="bookingIntro"><div className="bookingIntroInner"><span className="kicker">Your Tripple S visit</span><h1>A few details. <em>We’ll take it from here.</em></h1><p>Tell us how to reach you and what you have in mind. You can choose a treatment or ask the clinical team to guide you.</p><div className="bookingSteps"><span><b>01</b> Your details</span><span><b>02</b> Your preferences</span><span><b>03</b> We confirm with you</span></div></div></div>
    <div className="formWrap formWrapWide">
      {submitted ? <div className="formCard confirm confirmEditorial"><span className="confirmIcon">✦</span><span className="kicker">Request received</span><h2>Thank you. We’ll be in touch.</h2><p>Your reference is <strong>#{reference}</strong>. Keep it for your records.</p><p>The team will review your request and contact you to discuss timing and next steps. This is a request, not a confirmed appointment.</p><div className="actions" style={{ justifyContent: "center" }}><Link href="/" className="button buttonPrimary">Back to Tripple S</Link><a href={whatsapp} className="button buttonLight">Contact the clinic</a></div></div> :
      <div className="bookingLayout">
        <form className="formCard bookingForm" onSubmit={handleSubmit}>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>01</span><div><h2>How can we reach you?</h2><p>Just the essentials to get your request to the right person.</p></div></div>
            <div className="formGrid">
              <div className="field fieldFull"><label htmlFor="name">Your full name</label><input id="name" name="name" required autoComplete="name" placeholder="e.g. Kopano Gatsha"/></div>
              <div className="field"><label htmlFor="phone">WhatsApp / mobile number</label><input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+267 …"/></div>
              <div className="field"><label htmlFor="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"/></div>
            </div>
          </section>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>02</span><div><h2>What brings you in?</h2><p>Returning client or first visit, you can request an appointment without creating an account.</p></div></div>
            <div className="clientChoice" role="group" aria-label="Client type"><button type="button" className={clientType === "NEW" ? "clientChoiceOption active" : "clientChoiceOption"} onClick={() => setClientType("NEW")}><strong>First visit</strong><span>Help me get started</span></button><button type="button" className={clientType === "RETURNING" ? "clientChoiceOption active" : "clientChoiceOption"} onClick={() => setClientType("RETURNING")}><strong>Returning client</strong><span>I’ve visited before</span></button></div>
            <div className="field"><label htmlFor="serviceId">Choose a treatment or consultation</label><select id="serviceId" name="serviceId" value={serviceId} onChange={(event) => setServiceId(event.target.value)}><option value="">{loadingServices ? "Loading the menu…" : "I’m not sure — help me choose"}</option>{services.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.price} · {item.duration}</option>)}</select><small>You can leave this blank. The clinical team can help you decide.</small></div>
            {selected && <div className="selectedTreatment"><div><span className="kicker">Your selection</span><strong>{selected.name}</strong><p>{selected.description}</p></div><div className="selectedTreatmentPrice"><strong>{selected.price}</strong><span>{selected.duration}</span></div>{selected.consultationRequired && <p className="selectedTreatmentNote">Clinical assessment may be required. Suitability is determined by the Tripple S clinical team.</p>}</div>}
          </section>
          <section className="bookingFormSection"><div className="bookingSectionHeading"><span>03</span><div><h2>When works for you?</h2><p>These are preferences only. The team will confirm the actual appointment time.</p></div></div>
            <div className="formGrid"><div className="field"><label htmlFor="date">Preferred date <span>(optional)</span></label><input id="date" name="date" type="date" min={minDate}/><small>Sunday requests are welcome by appointment. Your preferred date and time are not confirmed until the team contacts you.</small></div><div className="field"><label htmlFor="time">Preferred time <span>(optional)</span></label><input id="time" name="time" type="time"/></div><div className="field fieldFull"><label htmlFor="message">Anything else we should know? <span>(optional)</span></label><textarea id="message" name="message" placeholder="Your goal, preferred timing or a question. Please do not include sensitive medical details here."/></div></div>
          </section>
          {error && <p className="bookingError" role="alert">{error}</p>}
          <button className="button buttonPrimary bookingSubmit" type="submit" disabled={busy}>{busy ? "Sending your request…" : "Send appointment request"} <span aria-hidden="true">→</span></button>
          <p className="bookingPrivacy">Your details are used to respond to this request. Please do not enter sensitive medical information in this form.</p>
        </form>
        <aside className="bookingAside"><div className="bookingAsideImage"><span className="placeholderMonogram">S</span><span className="placeholderLabel">CLINIC PHOTOGRAPHY PLACEHOLDER</span></div><div className="bookingAsideContent"><span className="kicker">A clear next step</span><h3>We’ll confirm with you personally.</h3><ol><li>Your request reaches the Tripple S team.</li><li>The team reviews your preferred treatment and timing.</li><li>You are contacted to confirm the appointment details.</li></ol><p>Sending a request does not confirm a booking or payment.</p><div className="asideContact"><strong>Visit us</strong><span>Plot 943, Kaunda Road, Gaborone</span><span>Monday – Saturday · 8:00 – 17:00</span><span>Sunday · By appointment</span></div><a href={whatsapp} className="textLink">Need help? Contact the clinic →</a></div></aside>
      </div>}
    </div>
  </main>;
}
