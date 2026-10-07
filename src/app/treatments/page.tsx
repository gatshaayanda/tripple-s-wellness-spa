"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPublicServices, type ServiceRecord } from "@/lib/firebase/data";

const categories = ["All", "IV Wellness Drips", "Medical Aesthetics", "Skin Treatments", "Body Contouring", "Wellness", "Consultations"];

export default function TreatmentsPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void getPublicServices()
      .then((items) => setServices(items.filter((x) => x.active)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return services.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const searchMatch = !term || [item.name, item.category, item.description].join(" ").toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [services, category, search]);

  const grouped = filtered.reduce<Record<string, ServiceRecord[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <main className="site">
      <nav className="nav">
        <div className="container navInner">
          <Link href="/" className="brand"><span className="brandMark">S</span><span>TRIPPLE S<span>WELLNESS SPA</span></span></Link>
          <Link href="/book" className="button buttonPrimary">Book an appointment</Link>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <span className="kicker">Treatments & pricing</span>
            <h1>Find the care that fits your goal.</h1>
            <p>Browse the published Tripple S catalogue, or start with a consultation if you are not sure what is right for you. Prices are shown in Botswana Pula. Suitability is determined by the Tripple S clinical team.</p>
          </div>

          {!loading && services.length > 0 && (
            <div className="catalogTools" aria-label="Treatment filters">
              <input
                className="catalogSearch"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search treatments…"
                aria-label="Search treatments"
              />
              <div className="filterChips" role="group" aria-label="Treatment categories">
                {categories.map((item) => (
                  <button key={item} type="button" className={category === item ? "filterChip active" : "filterChip"} onClick={() => setCategory(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="loadingCard">Opening the treatment catalogue…</div>
          ) : services.length === 0 ? (
            <div className="emptyPublic">
              <h3>The treatment catalogue is not published yet.</h3>
              <p>Start with a consultation and the team can guide you.</p>
              <Link href="/book?service=skin-consultation" className="button buttonPrimary">Book a consultation</Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="emptyPublic">
              <h3>No published treatment matches that search.</h3>
              <p>Try another term or browse all categories.</p>
              <button type="button" className="button buttonLight" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <section key={group} style={{ marginBottom: 55 }}>
                <div className="sectionHead"><span className="kicker">{group}</span></div>
                <div className="serviceGrid">
                  {items.map((item) => (
                    <article className="serviceCard" key={item.id}>
                      <span>{item.duration}</span>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      {item.assessmentNote && <p><strong>{item.assessmentNote}</strong></p>}
                      <div className="serviceMeta"><strong>{item.price}</strong><small>{item.consultationRequired ? "Assessment may be required" : "Appointment request"}</small></div>
                      <div className="actions serviceCardActions">
                        <Link href={`/treatments/${encodeURIComponent(item.id)}`} className="button buttonLight">View details</Link>
                        <Link href={`/book?service=${encodeURIComponent(item.id)}`} className="button buttonDark">Request appointment</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </section>

      <section className="confidence">
        <div className="container confidenceGrid">
          <div><span className="kicker">Not sure?</span><h2>Tell us what you want to improve.</h2><p>You do not need to diagnose yourself or choose the perfect treatment before speaking with the team.</p></div>
          <Link href="/book?service=skin-consultation" className="button buttonLight">Book a consultation</Link>
        </div>
      </section>
    </main>
  );
}
