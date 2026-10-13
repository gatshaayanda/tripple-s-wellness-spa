"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getClinicSettings, getPublicProducts, getPublicServices, type ProductRecord, type ServiceRecord } from "@/lib/firebase/data";
import { defaultClinicSettings, dayLabels, isAnnouncementVisible, type ClinicSettings, type DayKey } from "@/lib/tripple-s/clinic-settings";

const categories = [
  { title: "IV Wellness", detail: "Clinician-guided wellness drips and personalised support.", symbol: "✦" },
  { title: "Skin Treatments", detail: "Facials, peels and skin-focused care.", symbol: "◌" },
  { title: "Medical Aesthetics", detail: "Aesthetic treatments with professional oversight.", symbol: "＋" },
  { title: "Body Contouring", detail: "Explore body-contouring and wellness options.", symbol: "⌁" },
];
const whatsapp = "https://wa.me/26774866703?text=Hello%20Tripple%20S%2C%20I%27d%20like%20to%20enquire.";

function ImagePlaceholder({ imageUrl, label, className = "" }: { imageUrl?: string; label: string; className?: string }) {
  return <div className={`imagePlaceholder ${className}`} role="img" aria-label={label} style={imageUrl ? { backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(23,22,20,.34)), url("${imageUrl}")` } : undefined}>
    {!imageUrl && <><span className="placeholderMonogram">S</span><span className="placeholderLabel">TRIPPLE S · IMAGE TO ADD</span></>}
  </div>;
}

export default function Home() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(defaultClinicSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void Promise.all([getPublicServices(), getPublicProducts(), getClinicSettings()])
      .then(([serviceItems, productItems, settings]) => {
        if (!active) return;
        setServices(serviceItems.filter((item) => item.active));
        setProducts(productItems.filter((item) => item.active));
        setClinicSettings(settings);
      })
      .catch(() => { if (active) { setServices([]); setProducts([]); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const showAnnouncement = isAnnouncementVisible(clinicSettings);
  const hoursText = (day: DayKey) => { const hours = clinicSettings.openingHours[day]; return !hours.open ? "Closed" : `${hours.byAppointment ? "By appointment" : "Open"} · ${hours.start}–${hours.end}`; };

  return <main className="site">
    {showAnnouncement && <div className="publicAnnouncement" role="status"><strong>{clinicSettings.announcement.title || "Clinic notice"}</strong><span>{clinicSettings.announcement.message}</span></div>}
    <div className="topbar"><div className="container topbarInner"><span>Plot 943, Kaunda Road · Gaborone</span><strong>Medical Aesthetics · Skin Health · Wellness</strong><a href="tel:+26774866703">Call the clinic</a></div></div>
    <nav className="nav"><div className="container navInner"><Link href="/" className="brand" aria-label="Tripple S Wellness Spa home"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link><div className="navLinks"><a href="#treatments">Treatments & prices</a><a href="#our-care">Our approach</a><a href="#visit">Visit</a></div><Link href="/book" className="button buttonPrimary">Book a visit <span aria-hidden="true">↗</span></Link></div></nav>

    <section className="hero heroEditorial">
      <div className="container heroGrid">
        <div className="heroCopy">
          <span className="eyebrow">A considered kind of care · Gaborone</span>
          <h1>Feel good in your skin. <em>Feel cared for.</em></h1>
          <p>Medical aesthetics, skin health and wellness, with professional oversight and a personal touch. Start with a treatment you know, or tell us what you hope to improve.</p>
          <div className="actions"><Link href="/treatments" className="button buttonPrimary">Explore treatments & prices</Link><Link href="/book?service=skin-consultation" className="button buttonLight">Help me choose</Link></div>
          <div className="trustLine"><span>✦</span> Personalised care <span>·</span> Discreet setting <span>·</span> Clinical guidance</div>
        </div>
        <div className="heroArtwork">
          <ImagePlaceholder label="Tripple S hero photography placeholder" className="heroImage" />
          <div className="heroCaption"><span>TRIPPLE S WELLNESS SPA</span><strong>Where beauty meets medical excellence.</strong><small>Photography placeholder · replace with approved clinic imagery</small></div>
          <div className="heroStamp"><span>CARE</span><span>WITH</span><span>CLARITY</span></div>
        </div>
      </div>
    </section>

    <section className="introStrip"><div className="container introStripInner"><span className="kicker">Your visit, made simpler</span><p>Explore the menu, see published prices and send a request in a few steps. No account is required to get started.</p><Link href="/book" className="textLink">Start your request →</Link></div></section>

    <section id="our-care" className="section sectionSoft"><div className="container"><div className="sectionHead"><span className="kicker">Our approach</span><h2>Clinical care, with room to feel at ease.</h2><p>Your goals matter. The Tripple S clinical team guides suitability and next steps, so you do not have to diagnose yourself or know exactly where to begin.</p></div><div className="cards">{categories.map((item) => <article className="card careCard" key={item.title}><div className="cardIcon">{item.symbol}</div><h3>{item.title}</h3><p>{item.detail}</p><Link href="/treatments" className="textLink">Explore options →</Link></article>)}</div></div></section>

    <section id="treatments" className="section"><div className="container"><div className="sectionHead sectionHeadRow"><div><span className="kicker">Treatments & pricing</span><h2>Find a place to begin.</h2><p>Published prices are shown in Botswana Pula. Some treatments may require a consultation or assessment.</p></div><Link href="/treatments" className="textLink">View full menu →</Link></div>
      {loading ? <div className="loadingCard">Opening the Tripple S menu…</div> : services.length === 0 ? <div className="emptyPublic"><h3>The menu is temporarily unavailable.</h3><p>You can still request a consultation and the team can guide you.</p><Link href="/book?service=skin-consultation" className="button buttonPrimary">Start with a consultation</Link></div> : <div className="serviceGrid homeServiceGrid">{services.slice(0, 6).map((service) => <article className="serviceCard homeServiceCard" key={service.id}><ImagePlaceholder imageUrl={service.imageUrl} label={`${service.name} photography`} className="serviceImage" /><span>{service.category}</span><h3>{service.name}</h3><p>{service.description}</p><div className="serviceMeta"><strong>{service.price}</strong><small>{service.duration}</small></div><Link href={`/book?service=${encodeURIComponent(service.id)}`} className="button buttonDark">Request this treatment</Link></article>)}</div>}
      <div className="catalogNote"><span>✦</span><p>Not sure which treatment is right for you? Start with a consultation. Suitability is determined by the Tripple S clinical team.</p><Link href="/book?service=skin-consultation" className="textLink">Ask for guidance →</Link></div>
    </div></section>

    <section className="memberSection"><div className="container memberGrid"><div><span className="kicker">Your Tripple S journey</span><h2>Good care should feel personal from the first visit.</h2><p>Start with a simple request today. We’re shaping a more connected client experience for returning visits and future member benefits.</p></div><div className="memberCard"><span className="memberSymbol">S</span><strong>Your care, all in one place.</strong><p>No account needed to request your first visit. We’ll make the next steps clear.</p><Link href="/book" className="button buttonLight">Make an appointment request</Link></div></div></section>

    {products.length > 0 && <section className="section productSection"><div className="container"><div className="sectionHead sectionHeadRow"><div><span className="kicker">At-home skincare</span><h2>Continue your routine with care.</h2><p>Explore products listed by Tripple S. Contact the team to enquire about current availability.</p></div></div><div className="productGrid">{products.slice(0, 5).map((product) => <article className="productCard" key={product.id}><ImagePlaceholder imageUrl={product.imageUrl} label={`${product.name} product image`} className="productImage" /><span className="kicker">{product.size || "Professional skincare"}</span><h3>{product.name}</h3><p>{product.description}</p><div className="serviceMeta"><strong>{product.price}</strong><a href={`https://wa.me/26774866703?text=${encodeURIComponent(`Hello Tripple S, I would like to enquire about ${product.name} (${product.price}).`)}`} className="textLink">Enquire →</a></div></article>)}</div></div></section>}

    <section id="visit" className="visit"><div className="container visitGrid"><div><span className="kicker">Visit Tripple S</span><h2>Your appointment starts with clarity.</h2><p>Plot 943, Kaunda Road, Gaborone, Botswana.</p><div className="publicHours">{(Object.keys(dayLabels) as DayKey[]).map(day=><p key={day}><strong>{dayLabels[day]}</strong><span>{hoursText(day)}</span></p>)}</div><small>Hours and holiday notices are maintained by Tripple S. A request is not a confirmed appointment.</small></div><div className="visitCard"><strong>What happens next</strong><ol><li>Tell us what you are interested in.</li><li>The team reviews your request.</li><li>Tripple S contacts you to confirm timing and next steps.</li></ol><Link href="/book" className="button buttonPrimary">Request an appointment</Link></div></div></section>

    <footer className="footer"><div className="container footerGrid"><div><div className="brand brandFooter"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></div><p>Medical aesthetics · Skin health · Wellness</p><a href={whatsapp}>Questions? Contact the clinic</a></div><div><strong>Explore</strong><Link href="/treatments">Treatments & prices</Link><Link href="/book">Book a visit</Link><a href="#our-care">Our approach</a></div><div><strong>Find us</strong><span>Plot 943, Kaunda Road</span><span>Gaborone, Botswana</span>{(Object.keys(dayLabels) as DayKey[]).map(day=><span key={day}>{dayLabels[day]} · {hoursText(day)}</span>)}</div></div><div className="container footerBottom"><span>© 2026 Tripple S Wellness Spa</span><Link href="/admin" className="adminFooterLink" aria-label="Admin sign in">Admin</Link></div></footer>
  </main>;
}
