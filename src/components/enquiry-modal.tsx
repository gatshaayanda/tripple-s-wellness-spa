"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { makeLocalDemoId, saveLocalDemoRecord } from "@/lib/tripple-s/local-demo";

type EnquiryKind = "PRODUCT" | "TREATMENT" | "GENERAL";

export default function EnquiryModal({
  open, onClose, kind, itemId, itemName, itemPrice,
}: {
  open: boolean; onClose: () => void; kind: EnquiryKind; itemId?: string; itemName?: string; itemPrice?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [localOnly, setLocalOnly] = useState(false);

  useEffect(() => {
    if (!open) { setBusy(false); setError(""); setSubmitted(false); setReference(""); setLocalOnly(false); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) { if (event.key === "Escape" && !busy) onClose(); }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onClose]);

  if (!open) return null;
  const heading = kind === "PRODUCT" ? "Ask about product availability" : kind === "TREATMENT" ? "Ask about this treatment" : "Send Tripple S an enquiry";
  const intro = kind === "PRODUCT"
    ? "Tell us how to reach you. The team will check current availability and follow up during clinic operating hours."
    : kind === "TREATMENT"
      ? "Ask a question before deciding. The clinical team will respond and advise on the appropriate next step."
      : "Share a question or tell us what you need help with. The team will follow up during clinic operating hours.";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind, itemId,
          name: String(form.get("name") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim(),
          email: String(form.get("email") ?? "").trim(),
          message: String(form.get("message") ?? "").trim(),
          website: String(form.get("website") ?? "").trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your enquiry could not be sent. Please try again.");
      setReference(String(result.reference || result.id || "").slice(0, 8).toUpperCase());
      setLocalOnly(false);
      setSubmitted(true);
    } catch (err) {
      try {
        const id = makeLocalDemoId();
        const requestType = kind === "PRODUCT" ? "PRODUCT_ENQUIRY" : kind === "TREATMENT" ? "TREATMENT_ENQUIRY" : "GENERAL_ENQUIRY";
        saveLocalDemoRecord({ id, createdAt: new Date().toISOString(), requestType, name: String(form.get("name") ?? "").trim(), phone: String(form.get("phone") ?? "").trim(), email: String(form.get("email") ?? "").trim(), serviceNameSnapshot: itemName || (kind === "GENERAL" ? "General client enquiry" : "Client enquiry"), productId: kind === "PRODUCT" ? itemId : undefined, productNameSnapshot: kind === "PRODUCT" ? itemName : undefined, serviceId: kind === "TREATMENT" ? itemId : undefined, clientType: "NEW", status: "NEW", paymentStatus: "PAYMENT_PENDING", message: String(form.get("message") ?? "").trim(), localOnly: true });
        setReference(id.slice(-6).toUpperCase());
        setLocalOnly(true);
        setSubmitted(true);
      } catch {
        setError(err instanceof Error ? err.message : "Your enquiry could not be sent. Please try again.");
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="enquiryBackdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section className="enquiryDialog" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" aria-describedby="enquiry-description">
        <button className="enquiryClose" type="button" aria-label="Close enquiry" onClick={onClose} disabled={busy}>×</button>
        <span className="enquirySpark" aria-hidden="true">✦</span>
        <span className="kicker">TRIPPLE S · CLIENT CARE</span>
        <h2 id="enquiry-title">{submitted ? "Your enquiry is with the team." : heading}</h2>
        <p id="enquiry-description">{submitted ? localOnly ? "This enquiry is saved on this device only. It has not been sent to Tripple S. Please retry when online or contact the clinic directly." : "Thank you. Keep this reference for your records. This is an enquiry receipt, not an appointment confirmation." : intro}</p>
        {itemName && <div className="enquiryItem"><strong>{itemName}</strong>{itemPrice && <span>{itemPrice}</span>}</div>}
        {submitted ? (
          <div className="enquirySuccess" role="status"><span>{localOnly ? "!" : "✓"}</span><strong>{localOnly ? "Saved on this device" : "Enquiry received"}</strong>{reference && <small>Reference #{reference}</small>}{localOnly && <a className="button buttonLight" href="https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%20sent%20an%20enquiry%20through%20your%20app%20and%20would%20like%20to%20follow%20up.">Contact the clinic on WhatsApp</a>}<button className="button buttonPrimary" type="button" onClick={onClose}>Back to Tripple S</button></div>
        ) : (
          <form className="enquiryForm" onSubmit={submit}>
            <label>Your name<input name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label>
            <label>WhatsApp / mobile<input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder="+267 …" /></label>
            <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={200} placeholder="you@example.com" /></label>
            <label>Your question <span>(optional)</span><textarea name="message" maxLength={1000} placeholder={kind === "PRODUCT" ? "Ask about current availability or product details." : "What would you like the team to know?"} /></label>
            <div className="enquiryHoneypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {error && <p className="enquiryError" role="alert">{error}</p>}
            <button className="button buttonPrimary enquirySubmit" type="submit" disabled={busy}>{busy ? "Sending enquiry…" : "Send enquiry"} <span aria-hidden="true">→</span></button>
            <small>Your details are used to respond to this enquiry. Please do not include sensitive medical information.</small>
          </form>
        )}
      </section>
    </div>
  );
}
