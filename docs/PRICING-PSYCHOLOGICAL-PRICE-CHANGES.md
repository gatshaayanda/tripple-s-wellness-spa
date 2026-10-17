# Tripple S psychological pricing seed changes

Branch: `chore/seed-psychological-pricing`

## Rule applied to seed data
Treatment prices were adjusted by **P5** where applicable, retaining any `from` prefix. The nine existing facial treatments priced at P495 remain at P495; the new Hydro Facial is P95. Product prices are unchanged. This changes round prices to endings such as `95`, `945`, `1,195`, and `1,995`. This is a proposed pricing-format pass, not a clinical/business approval of the underlying amounts.

## New seed entry
- **Hydro Facial:** set to **P95** as requested; it is the lowest-priced seeded facial option.
- The existing **Hydrafacial + Hydro Jelly Mask** remains a separate treatment, changed from P400 to P395 rather than replaced.

## Treatment seed changes

| Treatment | Previous seeded price | New seeded price | Reduction |
|---|---:|---:|---:|
| Deep Cleansing Facial | P495 | P495 | P0 (unchanged) |
| Hydrafacial + Hydro Jelly Mask | P495 | P495 | P0 (unchanged) |
| Dermaplaning | P495 | P495 | P0 (unchanged) |
| LED Light Therapy | P495 | P495 | P0 (unchanged) |
| Brightening Facial | P495 | P495 | P0 (unchanged) |
| Anti-Acne Facial | P495 | P495 | P0 (unchanged) |
| Chemical Peels | P495 | P495 | P0 (unchanged) |
| Hydrating Facial | P495 | P495 | P0 (unchanged) |
| Sensitive Skin Facial | P495 | P495 | P0 (unchanged) |
| Microneedling | P1,400 | P1,395 | P5 |
| Microneedling + Exosomes | P2,000 | P1,995 | P5 |
| PRP Skin Rejuvenation | P1,800 | P1,795 | P5 |
| Nano-Needling | P1,200 | P1,195 | P5 |
| Anti-Acne Peel | P900 | P895 | P5 |
| Pigmentation Treatments | from P950 | from P945 | P5 |
| Melasma Management | P1,200 | P1,195 | P5 |
| Acne Scar Treatments | P1,400 | P1,395 | P5 |
| Fine Lines & Wrinkle Treatments | P1,200 | P1,195 | P5 |
| Skin Texture Improvement | P1,200 | P1,195 | P5 |
| Skin Rejuvenation Packages | from P2,000 | from P1,995 | P5 |
| Anti-Acne Chemical Peel | P900 | P895 | P5 |
| Acne Consultation & Skin Assessment | P400 | P395 | P5 |
| Acne Facial | P350 | P345 | P5 |
| Post-Acne Dark Mark Treatment | P800 | P795 | P5 |
| Professional Acne Homecare Plans | from P600 | from P595 | P5 |
| Acne Scar Management | P1,200 | P1,195 | P5 |
| Body Contouring (non-invasive) | P1,500 | P1,495 | P5 |
| Fat Reduction Treatments | from P1,200 | from P1,195 | P5 |
| Body Firming Treatments | P1,200 | P1,195 | P5 |
| Cellulite Treatments | P1,000 | P995 | P5 |
| Tummy Contouring | P1,500 | P1,495 | P5 |
| Weight Management Consultations | P400 | P395 | P5 |
| Body Measurements & Progress Monitoring | P300 | P295 | P5 |
| Personalised Nutrition Plans | P800 | P795 | P5 |
| PRP Hair Restoration | P1,800 | P1,795 | P5 |
| PRP + Microneedling | P2,200 | P2,195 | P5 |
| Hairline Restoration | P1,800 | P1,795 | P5 |
| Scalp Assessment | P400 | P395 | P5 |
| Hair Thinning Management | P1,200 | P1,195 | P5 |
| Medical Hair Restoration Plans | from P2,500 | from P2,495 | P5 |
| IV Hydration Therapy | P800 | P795 | P5 |
| Vitamin Infusions | from P800 | from P795 | P5 |
| Wellness Drips | from P800 | from P795 | P5 |
| Glutathione Infusions (where appropriate) | P1,200 | P1,195 | P5 |
| Wellness Consultations | P400 | P395 | P5 |
| Sauna Therapy | P350 | P345 | P5 |
| Anti-Wrinkle Injections | from P1,800 | from P1,795 | P5 |
| Dermal Fillers | from P2,500 | from P2,495 | P5 |
| PRP Treatments | P1,800 | P1,795 | P5 |
| Medical-Grade Chemical Peels | P1,200 | P1,195 | P5 |
| Skin Tag Removal | P800 | P795 | P5 |
| Prescription-Based Skin Treatments | from P1,000 | from P995 | P5 |
| Medical Weight Management | P1,200 | P1,195 | P5 |
| Eyebrow Shaping | P200 | P195 | P5 |
| Lash Treatments | P350 | P345 | P5 |
| Lip Care Treatments | P300 | P295 | P5 |
| Hand & Foot Care | P300 | P295 | P5 |
| Back Facial | P400 | P395 | P5 |
| Décolletage Treatments | P450 | P445 | P5 |

## Product catalogue

Product prices are intentionally unchanged by this treatment-only pricing task.

## P295 prices
Prices already ending in 95 remain unchanged. The audio's examples consistently describe reducing round prices by P5 (for example P200 → P195, P800 → P795, P1,200 → P1,195, and P1,300 → P1,295). The transcript does not establish a separate P295 → P195 change, so no P100 reduction is applied.

## Important: seed data versus saved catalogue
These edits update the code's seed catalogue. The app deliberately preserves existing Firestore/admin-managed records, so this commit does **not** automatically overwrite prices already saved in Firebase. Historical booking price snapshots remain unchanged. The deployed catalogue still needs QA against saved Firestore records.

## Category wording
The seeded category label is now **Medical Weight Loss, Visible Weight Loss & Body Contouring**. The category document ID is unchanged.
