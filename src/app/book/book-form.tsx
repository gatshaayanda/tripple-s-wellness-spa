"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createBookingRequest, getServices, type ServiceRecord } from "@/lib/firebase/data";

const whatsapp = "https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%27d%20like%20to%20enquire.";

function localDateValue(){const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;}

export default function BookForm(){
  const searchParams=useSearchParams();
  const requestedService=searchParams.get("service") ?? "";
  const [services,setServices]=useState<ServiceRecord[]>([]);
  const [loadingServices,setLoadingServices]=useState(true);
  const [submitted,setSubmitted]=useState(false);
  const [reference,setReference]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const minDate=localDateValue();

  useEffect(()=>{void getServices().then(items=>setServices(items.filter(item=>item.active))).catch(()=>setServices([])).finally(()=>setLoadingServices(false));},[]);
  const selected=useMemo(()=>services.find(item=>item.id===requestedService),[services,requestedService]);

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); if(busy)return; setBusy(true); setError("");
    const form=new FormData(event.currentTarget);
    const serviceId=String(form.get("serviceId")??"");
    const service=services.find(item=>item.id===serviceId);
    const request={createdAt:new Date().toISOString(),name:String(form.get("name")??"").trim(),phone:String(form.get("phone")??"").trim(),email:String(form.get("email")??"").trim()||undefined,serviceId:service?.id,serviceNameSnapshot:service?.name||"Consultation / service enquiry",priceSnapshot:service?.price,durationSnapshot:service?.duration,preferredDate:String(form.get("date")??"").trim()||undefined,preferredTime:String(form.get("time")??"").trim()||undefined,message:String(form.get("message")??"").trim()||undefined,clientType:(String(form.get("clientType")??"NEW") as "NEW"|"RETURNING"),referralSource:String(form.get("referralSource")??"").trim()||undefined,status:"NEW" as const,paymentStatus:"PAYMENT_PENDING" as const};
    if(!request.name||!request.phone){setError("Please enter your name and WhatsApp/mobile number.");setBusy(false);return;}
    if(request.preferredDate&&request.preferredDate<minDate){setError("Please choose today or a future date.");setBusy(false);return;}
    try{const id=await createBookingRequest(request);setReference(id.slice(0,8).toUpperCase());setSubmitted(true);event.currentTarget.reset();}catch(err){console.error("[Tripple S] appointment request failed",err);setError("We could not record your request right now. Please try again or contact Tripple S on WhatsApp.");}finally{setBusy(false);}
  }

  return <main className="bookPage">
    <nav className="nav"><div className="container navInner"><Link href="/" className="brand"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link><a href={whatsapp} className="button buttonLight">WhatsApp</a></div></nav>
    <div className="formWrap">
      <div className="sectionHead"><span className="kicker">Appointment request</span><h1>Tell us what you would like to improve.</h1><p>You do not need to choose the perfect treatment. Select one if you know it, or start with a consultation and the clinical team can guide you.</p></div>
      <div className="formCard">{submitted?<div className="confirm"><div className="confirmIcon">✦</div><h2>Your request is received.</h2><p>Reference <strong>#{reference}</strong></p><p>The Tripple S team will review your request and contact you to confirm the details. This request is not yet a confirmed appointment.</p><div className="actions" style={{justifyContent:"center"}}><Link href="/" className="button buttonPrimary">Return to Tripple S</Link><a href={whatsapp} className="button buttonLight">WhatsApp Tripple S</a></div></div>:
      <form onSubmit={handleSubmit}><div className="formGrid">
        <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name"/></div>
        <div className="field"><label htmlFor="phone">WhatsApp / mobile</label><input id="phone" name="phone" type="tel" required autoComplete="tel"/></div>
        <div className="field fieldFull"><label htmlFor="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autoComplete="email"/></div>
        <div className="field fieldFull"><label htmlFor="serviceId">What would you like?</label><select id="serviceId" name="serviceId" defaultValue={selected?.id??requestedService}><option value="">{loadingServices?"Loading treatments…":"I’m not sure — help me choose"}</option>{services.map(item=><option key={item.id} value={item.id}>{item.name} · {item.price} · {item.duration}</option>)}</select></div>
        <div className="field"><label htmlFor="date">Preferred date <span>(optional)</span></label><input id="date" name="date" type="date" min={minDate}/></div>
        <div className="field"><label htmlFor="time">Preferred time <span>(optional)</span></label><input id="time" name="time" type="time"/></div>
        <div className="field"><label htmlFor="clientType">I am a</label><select id="clientType" name="clientType" defaultValue="NEW"><option value="NEW">New client</option><option value="RETURNING">Returning client</option></select></div>
        <div className="field"><label htmlFor="referralSource">How did you find us? <span>(optional)</span></label><select id="referralSource" name="referralSource" defaultValue=""><option value="">Select</option><option>Instagram</option><option>Facebook</option><option>Google</option><option>WhatsApp</option><option>Referral</option><option>Other</option></select></div>
        <div className="field fieldFull"><label htmlFor="message">Anything you want the team to know? <span>(optional)</span></label><textarea id="message" name="message" placeholder="Tell us your goal, concern, timing or question. Please do not include sensitive medical details here."/></div>
        <div className="field fieldFull"><button className="button buttonPrimary" type="submit" disabled={busy}>{busy?"Sending request…":"REQUEST APPOINTMENT"}</button></div>
      </div>{error&&<p role="alert" style={{color:"#a43b3b",lineHeight:1.6}}>{error}</p>}<p style={{color:"var(--muted)",fontSize:".82rem",lineHeight:1.6,marginBottom:0}}>Submitting a request does not confirm an appointment. Suitability is determined by the Tripple S clinical team.</p></form>}</div>
    </div>
  </main>;
}