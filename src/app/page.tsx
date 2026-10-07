"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicServices, type ServiceRecord } from "@/lib/firebase/data";

const categories = [
  ["IV Wellness Drips", "Hydration, glow and wellness support."],
  ["Skin Treatments", "Peels, facials and microneedling."],
  ["Medical Aesthetics", "Clinical aesthetic treatments with professional oversight."],
  ["Body Contouring", "Body contouring and sauna wellness."],
];

const whatsapp = "https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%27d%20like%20to%20enquire.";

export default function Home() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getPublicServices().then((items) => setServices(items.filter((item) => item.active))).catch(() => setServices([])).finally(() => setLoading(false));
  }, []);

  return <main className="site">
    <div className="topbar"><div className="container topbarInner"><span>Gaborone · Plot 943, Kaunda Road</span><strong>Medical Aesthetics · Wellness</strong><a href={whatsapp}>WhatsApp Tripple S</a></div></div>
    <nav className="nav"><div className="container navInner"><Link href="/" className="brand" aria-label="Tripple S Wellness Spa home"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link><div className="navLinks"><a href="#treatments">Treatments</a><a href="#care">Our care</a><a href="#visit">Visit</a></div><Link href="/book" className="button buttonPrimary">Book an appointment</Link></div></nav>

    <section className="hero">
      <div className="container heroGrid">
        <div>
          <span className="eyebrow">Medical Aesthetics · Gaborone</span>
          <h1>Where beauty meets <em>medical excellence.</em></h1>
          <p>Advanced medical aesthetics, IV wellness, skin health and body contouring — delivered with clinical precision in a serene, private setting.</p>
          <div className="actions"><Link href="/treatments" className="button buttonPrimary">Explore treatments</Link><Link href="/book?service=skin-consultation" className="button buttonLight">Book a consultation</Link></div>
          <p className="heroNote">Suitability is determined by the Tripple S clinical team.</p>
        </div>
        <div className="heroVisual" aria-label="Tripple S Wellness Spa"><div className="orb orbOne" /><div className="orb orbTwo" /><div className="heroCard"><span>TRIPPLE S</span><strong>Medical Wellness</strong><small>Personalised · Discreet · Clinical</small></div></div>
      </div>
    </section>

    <section id="care" className="section sectionSoft"><div className="container"><div className="sectionHead"><span className="kicker">Our care</span><h2>Clinical rigor, wrapped in warmth.</h2><p>Tripple S combines professional oversight with a calm, personal experience. Your goals, assessment and the clinical team&apos;s guidance shape what happens next.</p></div><div className="cards">{categories.map(([title,detail]) => <article className="card" key={title}><div className="cardIcon">{title === "IV Wellness Drips" ? "✦" : title === "Skin Treatments" ? "◌" : title === "Medical Aesthetics" ? "＋" : "⌁"}</div><h3>{title}</h3><p>{detail}</p></article>)}</div></div></section>

    <section id="treatments" className="section"><div className="container"><div className="sectionHead sectionHeadRow"><div><span className="kicker">Featured treatments</span><h2>Choose a treatment, or tell us what you want to improve.</h2></div><Link href="/treatments" className="textLink">View all treatments →</Link></div>{loading ? <div className="loadingCard">Opening the Tripple S treatment catalogue…</div> : services.length === 0 ? <div className="emptyPublic"><h3>The treatment catalogue is being prepared.</h3><p>You can still request a consultation and the clinical team can guide you.</p><Link href="/book?service=skin-consultation" className="button buttonPrimary">Book a consultation</Link></div> : <div className="serviceGrid">{services.slice(0, 6).map((service) => <article className="serviceCard" key={service.id}><span>{service.category}</span><h3>{service.name}</h3><p>{service.description}</p><div className="serviceMeta"><strong>{service.price}</strong><small>{service.duration}</small></div><div className="actions serviceCardActions"><Link href={`/treatments/${encodeURIComponent(service.id)}`} className="button buttonLight">View details</Link><Link href={`/book?service=${encodeURIComponent(service.id)}`} className="button buttonDark">Request appointment</Link></div></article>)}</div>}</div></section>

    <section className="confidence"><div className="container confidenceGrid"><div><span className="kicker">Before your visit</span><h2>Not sure what you need?</h2><p>Tell us what you would like to improve. You do not need to diagnose yourself or choose the perfect treatment before speaking with the team.</p></div><Link href="/book?service=skin-consultation" className="button buttonLight">Start with a consultation</Link></div></section>

    <section id="visit" className="visit"><div className="container visitGrid"><div><span className="kicker">Visit Tripple S</span><h2>Your appointment starts with clarity.</h2><p>Plot 943, Kaunda Road, Gaborone.</p><p>Mon – Fri 8:00 – 17:00<br />Saturday 8:00 – 17:00<br />Sunday by appointment</p></div><div className="visitCard"><strong>What happens next</strong><ol><li>Send an appointment request.</li><li>The team reviews your request.</li><li>Tripple S contacts you to confirm the details.</li></ol><div className="actions"><Link href="/book" className="button buttonPrimary">Request an appointment</Link><a href={whatsapp} className="button buttonLight">WhatsApp</a></div></div></div></section>

    <footer className="footer"><div className="container footerGrid"><div><div className="brand brandFooter"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></div><p>Medical aesthetics · Skin health · Wellness</p></div><div><strong>Explore</strong><Link href="/treatments">Treatments</Link><Link href="/book">Book</Link><a href={whatsapp}>WhatsApp</a></div><div><strong>Visit</strong><span>Plot 943, Kaunda Road</span><span>Gaborone, Botswana</span><span>Mon – Sat · 8:00 – 17:00</span></div></div><div className="container footerBottom">© 2026 Tripple S Wellness Spa</div></footer>
  </main>;
}