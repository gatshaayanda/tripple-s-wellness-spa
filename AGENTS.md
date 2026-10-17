# TRIPPLE S WELLNESS SPA — Agent Operating Contract

## Product
Tripple S Wellness Spa is a real customer-facing medical aesthetics, skin health and wellness business in Gaborone, Botswana.

Business:
- Tripple S Wellness Spa
- Plot 943, Kaunda Road, Gaborone, Botswana
- Medical aesthetics · Skin health · Wellness
- Doctor-supervised clinical environment
- Premium, calm, discreet client experience

This repository is the working Tripple S product repository. It was cloned from an Admin Hub technical foundation and must now be treated as Tripple S code, not as a Meating Place derivative.

**Fresha is a functional benchmark only. This project is not a Fresha migration and must not become a Fresha marketplace clone.**

## Product north star
Tripple S's own digital front desk and client-care system.

Customer journey:
Discover → Understand → Enquire → Book → Confirm → Prepare → Attend → Follow Up → Return

Business journey:
Enquiry → Review → Appointment → Payment → Arrival → Completion → Follow-up → Repeat

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- GitHub is the source of truth
- VS Code / Git Bash is the local review layer

## Workflow
**START → INSPECT → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER**

Golden rule:
**Unexpected result = STOP → inspect reality → then act.**

Always inspect the actual repository, Git state, Firebase project/configuration, deployed state, and relevant business workflow before changing code.

This repo was cloned as a working repository. Do not recreate the foundation from scratch unless inspection proves the foundation is unsuitable.

## Business relevance
Every feature must help at least one of:
1. attract potential clients
2. explain a real Tripple S treatment/service
3. help a client choose or enquire
4. capture an appointment request
5. help Tripple S review/confirm/manage appointments
6. manage clients operationally
7. communicate with clients
8. reduce no-shows and booking friction
9. provide preparation/aftercare information
10. support follow-up, repeat visits, reviews or skincare enquiries
11. help staff manage the service/product catalogue

Do not add generic SaaS, ERP, payroll, accounting, insurance, hospital-management, AI-diagnosis, prescription, or marketplace features.

## Clinical boundary
This is an operational/client-care application, not a diagnostic or medical-advice system.

Do not:
- diagnose conditions
- prescribe treatment
- independently determine clinical suitability
- invent contraindications
- present software recommendations as clinical decisions
- turn the client record into a full EMR

Use:
**“Suitability is determined by the Tripple S clinical team.”**

Capture client goals/concerns only where operationally useful. Minimise sensitive clinical information.

## Public experience
Mobile-first and premium.

Primary actions:
- Explore treatments
- Book an appointment
- I'm not sure what I need
- WhatsApp Tripple S

Treatment pages should make it easy to understand:
- treatment name
- category
- explanation
- price where published
- duration
- suitability / assessment note
- preparation
- aftercare
- consultation requirement
- booking CTA
- WhatsApp CTA

Do not fabricate services, pricing, opening hours, reviews, availability, claims or medical outcomes.

## Booking
A customer appointment request is not automatically confirmed.

V1 request fields:
- full name
- WhatsApp/mobile
- optional email
- selected service
- preferred date
- preferred time
- optional message
- new/returning
- referral source

Request statuses:
NEW → REVIEWING → APPROVED → PAYMENT_PENDING → CONFIRMED → ARRIVED → COMPLETED

Also supported where operationally needed:
NEEDS_CONTACT, DECLINED, RESCHEDULED, CANCELLED, NO_SHOW, FOLLOW_UP

Payment states:
PAYMENT_PENDING, PAYMENT_INSTRUCTIONS, PAYMENT_PROOF_SUBMITTED, PAYMENT_VERIFIED, PAID, REFUNDED

Do not invent a payment gateway. Payment is an extensible status layer until the real provider/instructions are confirmed.

When a request is stored, preserve service/name/price/duration snapshots so later catalogue changes do not rewrite history.

## Staff/admin
Authenticated staff only.

Core areas:
- TODAY
- NEW REQUESTS
- PAYMENT PENDING
- CONFIRMED
- FOLLOW-UP
- CLIENTS
- SERVICES
- PRODUCTS
- REVIEWS
- SETTINGS

V1 may be implemented incrementally, but every admin action must reflect a real Tripple S workflow.

Admin actions include:
- review request
- request clarification
- contact client
- approve/confirm
- reschedule
- cancel
- mark arrived/completed/no-show
- update payment state
- manage services
- manage products

No self-service staff/admin signup. Admin access is provisioned in Firebase.

## Data ownership
Use Firebase/Firestore as the shared business source of truth.

Target collections:
- admins
- services
- products
- clients
- bookingRequests / appointments
- payments
- followups
- reviews
- settings

Public users may create appointment requests without a Firebase account. Private operational reads/writes require an authenticated owner/staff role.

Default-deny Firestore rules are preferred.

## Firebase
The intended Tripple S Firebase project is:
**tripple-s-wellness-spa**

Browser Firebase configuration must remain environment-driven through NEXT_PUBLIC_FIREBASE_* variables.

Never:
- commit .env.local
- expose Firebase Admin credentials
- carry over Meating Place Firebase IDs or data
- weaken rules to hide permission errors

Verify the active Firebase project before changing rules or data.

## Media / branding
Use actual Tripple S brand assets when available. Do not invent a fake logo and claim it is the client's logo.

The live public site is a source of truth for current public-facing business content:
https://trippleswellnessspa.com/

Current public positioning:
“Where beauty meets medical excellence.”
Medical aesthetics, IV wellness, skin health and body contouring.

## PWA
Keep the installable/offline foundation where useful, but be truthful:
- a local/offline state is not the same as server receipt
- an unsent request must never be described as confirmed
- uploads, notifications, payments and remote actions must not be claimed successful without real confirmation

## Quality / verification
Before checkpointing:
- inspect changed files
- run npx tsc --noEmit
- run npm run lint
- run npm run build
- verify Firebase configuration paths
- verify no Meating Place / Avram / unrelated business content remains in active UI, metadata, routes or app logic
- verify public booking remains honest
- verify admin access remains protected
- verify the deployed result when deployment is available

Never call a feature complete based only on source-code confidence.

## Scope discipline
Do not build:
- Fresha migration/import
- Fresha marketplace
- AI dermatologist/diagnosis
- prescriptions
- full EMR
- insurance claims
- hospital management
- payroll/accounting
- inventory ERP
- multi-country enterprise
- fake payment integrations
- fake WhatsApp/SMS/email delivery
- fabricated testimonials or availability

Build the smallest useful Tripple S operating surface first, then extend it through controlled vertical slices.\n\nCurrent client-side slice includes: installable PWA prompt, active-only public service reads, treatment search/category filters, treatment detail pages with safe preparation/aftercare placeholders, and clearer appointment-request entry points. Next client slices: confirmed appointment experience, authenticated/secure appointment status access, reminders, follow-up/review journey, then richer client account features only where they materially improve care.

## Checkpoints
Every controlled change should end with:
1. actual change summary
2. verification result
3. commit
4. push
5. deployment state, if applicable
6. explicit user-side actions, if any

GitHub is the save point.

## User checkpoint / push rule
When the user says **“push”**, treat that as a QA checkpoint request:
- finish the agreed implementation slice first
- commit it to the intended remote branch
- push the latest commit to GitHub
- report the exact remote branch and commit SHA so the user can QA that state
- do **not** merge a branch/PR into `main` unless the user explicitly asks to merge
- do **not** treat GitHub Actions success as product QA; it only verifies the automated checks that actually ran
- do **not** tell the user the app is ready/fully updated for production merely because code was pushed
- distinguish clearly between **pushed for QA**, **CI verified**, **Vercel deployed/verified**, and **Firebase configured/verified**
- after a push, the user is the final product reviewer and QA owner; subsequent work should build from the exact pushed checkpoint.


---

## Product direction, operating constraints and audit checkpoint — 2026-10-13

This section records the current product direction and a dated source/deployment audit. Re-check GitHub, Vercel, Firebase and public business information before relying on the dated technical snapshot.

### Business and service principles

- Tripple S is a doctor-supervised medical aesthetics, skin health and wellness business at Plot 943, Kaunda Road, Gaborone. The clinical lead/owner is the final authority on services, suitability, prices, capacity, clinical wording and staff access.
- A trusted clinic assistant helps with day-to-day operations. Give each person an individually provisioned account; never share owner credentials. Keep permissions to the minimum needed for their duties. Confirm the assistant's exact operational permissions with the owner before implementing role differences.
- Historical audit note (superseded by the latest product-owner instruction below): an earlier note said Sundays were closed. **Current rule: Sunday is appointment-only, not fully closed.** Sunday must generate appointment slots within configured hours and must not accept walk-ins. Mondays and Wednesdays are busy, but do not infer that they are unavailable all day.
- Audit found a public-content conflict: the public site at https://trippleswellnessspa.com/ currently states “Sunday by appointment” and lists Mon–Sat 08:00–17:00. The user says Sunday is closed. The public domain also presents a product catalogue and client testimonials that are not evidenced as part of the current GitHub main app source. Treat the business owner's supplied operating facts as authoritative; reconcile public-site content, canonical domain, and app deployment before launch. Do not claim that this repository serves that custom domain until verified.
- Never fabricate treatment claims, suitability, outcomes, testimonials, reviews, pricing, stock, available slots, clinical advice or message/payment delivery. Use “Suitability is determined by the Tripple S clinical team.” Minimise sensitive information and do not turn this product into a diagnostic system or EMR.

### Plain-language current product boundary

The GitHub main source currently provides:
1. A public home page with service categories and active services from Firestore.
2. A treatment catalogue with search and category filters.
3. Treatment detail pages with published price/duration, clinical-assessment notes and safe generic preparation/aftercare placeholders.
4. A guest appointment-request form with name, phone, optional email, service, preferred date/time, optional message, new/returning status and referral source. It displays a request reference and tells the customer the request is not yet a confirmed appointment.
5. WhatsApp/call contact links.
6. An authenticated operations area with an appointment-request queue, request/payment status controls, and service/product catalogue management.

The main source does **not** currently prove real slot availability, instant booking, customer login/history/status tracking, payment collection or verification, automatic reminders, automated follow-up/review requests, a mature client-management workspace, supplier management, or actual notification delivery. Treat these as future work unless source and runtime evidence prove otherwise.

### Dated technical audit — verified repository/deployment evidence

- GitHub main at audit time: `8ad0a01f86f49b4e7ebe7af9f4a2345b52359ba3` (“docs: clarify push and QA checkpoint workflow”).
- Main CI run for that SHA succeeded. This is historical automated-check evidence, not proof of production/customer/admin/Firebase/PWA runtime behavior.
- Open draft PR #2, “feat: implement WhatsApp browser handoff and PWA install flow”, had head `9dc95b7b4b56f082d5012f5a7f77208dcdcba929`. Its latest inspected CI failed at `src/app/pwa-register.tsx:155` for `react/no-unescaped-entities`; TypeScript passed and lint stopped the build step. Do not merge it until the failure is fixed and the exact new head passes CI. Real WhatsApp/Instagram/Safari/Chrome/device installation QA remains separate.
- Vercel project inspection reported `live: false`, SSO protection enabled for deployments other than custom domains, and only `tripple-s-wellness-spa.vercel.app` attached to this project. Its latest production-target deployment was READY for main SHA `8ad0a01...`, but READY is not live-product verification. A newer preview deployment referenced SHA `6189e4b...`, which did not match the inspected GitHub PR head; do not treat it as evidence for the current PR head. The public `trippleswellnessspa.com` domain was not listed as attached to this Vercel project.
- Intended Firebase project is documented as `tripple-s-wellness-spa`, but deployed environment values, deployed Firestore/Storage rules, real auth, and customer data flows have not been verified by this source audit.
- The current `package.json` exposes `dev`, `build`, `start`, and `lint`; it does not yet provide The Plug's `verify:identity` or `verify:clone-readiness` gates. Build Tripple S-specific checks rather than copying The Plug-specific assertions.

### High-priority risks to resolve before broad customer use

1. **Deployment/domain truth:** identify the actual customer launch URL, the repository/commit that serves it, Vercel project/domain mapping and SSO behavior. Never announce a launch URL based on a READY deployment alone.
2. **Firestore request validation:** current `bookingRequests` rules allow public creates without field/schema validation. Review allowed keys, types, lengths, date/time formats, server-owned timestamps and status/payment fields; prevent public callers from setting privileged or misleading state. Add proportionate anti-abuse controls and test them without touching production customer data.
3. **Public catalogue privacy:** current `services` rule allows public reads of all service documents. Ensure unpublished/inactive content cannot be read publicly, not merely hidden by client-side filtering.
4. **PWA/private data:** current `public/sw.js` includes `/admin` in its shell and caches successful navigation responses generally. Adapt this so private/admin routes and sensitive responses are network-only and never enter shared caches. Keep only appropriate public shell/assets available offline. Offline/queued writes must clearly distinguish “saved on this device / waiting to send” from “received by Tripple S.”
5. **Admin authorization:** owner and staff currently share the same `isAdmin` permission set. Keep individual Firebase Auth identities, deny self-service role provisioning, and define least-privilege staff capabilities before granting broader client/payment/settings access.
6. **Operational truth:** the current booking form captures a preferred date/time but has no source-verified live capacity calendar. Treat it as a request until an authorized staff member checks capacity and confirms. Explicitly block Sundays; handle Monday/Wednesday demand honestly and avoid double-booking. Do not claim an open slot from a preferred-time field.
7. **CI and QA:** repair the open PWA PR's lint failure, rerun TypeScript/lint/build on the exact candidate SHA, then test customer/admin flows and PWA handoff on supported real devices. Automated CI is not real-world QA.

### Occam's-razor delivery roadmap

**P0 — Make the current app trustworthy before adding modules**
- Reconcile the real domain, deployed commit, Firebase project/configuration and public operating information.
- Close public Firestore validation/privacy gaps and prevent private admin content from being cached.
- Fix and verify the current PWA handoff branch; keep installation optional.
- Confirm the service list/prices, Sunday closure, busy-day handling, exact opening hours, payment policy and staff permissions with the owner.

**P1 — Make the daily appointment workflow dependable**
- Keep guest-first discovery and request submission.
- Make the admin queue easy to work in: new requests first, preferred date/time visible, service/price snapshot, clear next action, contact links, status history and reliable refresh/persistence.
- Give staff a simple capacity-aware calendar/availability control only after actual hours, treatment durations, buffers, staff/room capacity and Monday/Wednesday limits are supplied. Until then, manual review and explicit confirmation remain the source of truth.
- Make the customer's next step unmistakable: request received, under review, clarification needed, payment instructions (only if owner-approved), confirmed, rescheduled/cancelled, attended/completed. Never conflate request, confirmation or payment.

**P2 — Returning-client account and loyalty (after the first-visit journey is proven)**
- The first appointment request must remain guest-first: no account, password, app installation or email requirement before a customer can enquire.
- Account benefits are part of onboarding design, but never block the first booking. Keep guest booking fast; invite customers to create/link an account after request submission to retain appointment history and access owner-published offers/rewards. Admin must CRUD loyalty/discount programmes (discount type/value, eligibility, code, active dates and status); only active, valid programmes may appear publicly. Never invent rewards or balances.
- Do **not** add automated WhatsApp reminders, rescheduling/cancellation workflows, treatment-specific preparation/aftercare campaigns, follow-up/review request campaigns or automated messaging as part of this scope unless the product owner explicitly reopens it.
- Keep skincare products as an accurate client-facing catalogue/enquiry flow until the owner explicitly approves stock, ordering, fulfilment and payment workflows. Supplier/vendor management and inventory ERP are not MVP scope.
- Do not invent treatment bundles or package prices: the inspected official public website publishes treatment prices and five skincare products, but no defined package menu. Admin may add a package under the editable “Packages” catalogue category when the business supplies approved package names, contents and prices.

**P3 — Measure and improve based on real outcomes**
- Add privacy-minimised, owner-only analytics for source → treatment views → booking starts → submitted requests → response time → confirmations → attendance/completion → repeat visits. Do not capture clinical notes or unnecessary personal data in analytics.
- Use the data to improve capacity, service information and return visits; do not add dashboards before the underlying events and business statuses are trustworthy.

### UX and behavioral-science rules

- Offer two calm entry paths: **“I know what I want”** (browse/search treatments) and **“Help me choose”** (request a consultation). The app helps clients ask; clinical suitability stays with the team.
- Reduce cognitive load: clear category names, transparent published prices/durations, labels above fields, short forms, visible next steps, forgiving validation and recoverable errors. Do not force sign-in or installation before the first request.
- Build trust through accurate service information, clear clinical oversight, privacy, real consented reviews, authentic team/clinic details and honest status messages—not artificial scarcity, pressure, invented results or fake testimonials.
- Apply behavioral-science findings to the in-app experience: reduce cognitive load, show clear prices, make the next step predictable and keep first-time requests short. Do not add reminder campaigns without explicit product-owner approval.
- Competitor benchmark (not a template to copy): local providers such as AesthetiQue, Phemo Aesthetics and Medi Glow publish service information/prices and offer booking or product pathways; some use Fresha, while Medi Glow also presents its own product/booking experience. Tripple S should compete on its own calm, medically responsible client-care relationship and operational follow-through—not by becoming a marketplace.
- Phaser is **not appropriate for this product's core workflow**: a medical-aesthetics booking/client-care app has no demonstrated need for a game engine. Do not add game mechanics or Phaser dependencies unless a separate, validated product requirement justifies them.

### Research and reference links

- Mandatory Admin Hub method: [The Plug CLONING.md](https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/CLONING.md), [App Factory SOP](https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/docs/ADMIN-HUB-APP-FACTORY-SOP.md), [Clone/Reset Checklist](https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/docs/CLONE-RESET-CHECKLIST.md).
- Local competitor examples: [AesthetiQue Medical Clinic on Fresha](https://www.fresha.com/a/aesthetique-medical-clinic-gaborone-unit-11-eg27anrk), [Phemo Aesthetics](https://phemo.co.bw/contact.html), [Medi Glow Aesthetics](https://mediglowaesthetics.co.bw/).
- Appointment reminders: [2016 BMJ Open systematic review/meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC5093388/), [2023 behavioral interventions systematic review/meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10594857/).
- Mobile form usability: [Baymard mobile form/checkout research](https://baymard.com/research-articles/mobile-checkout).

### Inheritance rule for other Admin Hub repositories

The Plug remains the authoritative methodology and mandatory starting foundation for new apps; this existing Tripple S repository is not to be rebuilt from scratch. Reuse only verified, relevant patterns from other projects:
- JTS: platform-aware embedded-browser → normal-browser → optional PWA-install handoff, after its own CI and device QA pass.
- BOEMO: server-side Firebase Admin/FCM notification pattern only after adapting identity, token ownership, authorization and delivery tests; do not copy credentials or assume delivery.
- Namane Tyres: owner-only, privacy-minimised event analytics pattern only after Tripple S event definitions and consent/privacy boundaries are agreed.
Do not copy another app's branding, business schema, credentials, database, deployment bindings, private data or unverified claims.

### Acceptance rule

Use The Plug's evidence vocabulary: **PASS / FAIL / NOT RUN / BLOCKED**. A code review, green build, READY deployment, browser permission prompt or notification-send response is not proof of the full customer outcome. Verify the customer journey, authorized admin workflow, server/database access boundaries, deployment identity, PWA/private-cache behavior and real-device behavior separately. Do not deploy, merge, deploy Firebase rules/indexes, mutate production data or incur material cost without explicit authorization.


### Product owner QA direction — landing and booking slice (2026-10-13)

- The app is intended to become Tripple S's primary digital front desk; the owned website is a verified source for approved service/product content, not a second booking destination to promote instead of the app.
- Landing page must show a real seeded treatment menu with published prices/durations, a product catalogue with published prices, clear booking actions, and owner-managed weekly hours. Sunday is available by appointment by default; never label it closed unless the owner changes the hours. Monday and Wednesday are busy; do not pretend a preferred date is confirmed availability.
- Use tasteful image placeholders until the owner supplies approved social/clinic/product imagery. Admin can manage public image URLs alongside service/product descriptions, prices, durations, active visibility and the “Packages” catalogue category. Admin-managed clinic settings control each day’s open/closed state, appointment-only status, time window, and a dated public announcement for holiday hours or temporary notices.
- The footer contains a small one-word **Admin** link to the existing protected `/admin` sign-in; do not expose operational content or add self-service admin registration.
- Booking must feel light for new and returning clients. Account creation must not block the first request. Customer identity linking and saved appointment history remain a separate verified slice; discount programmes are admin-managed records, not generic promises.
- Do not build reminder automation, rescheduling/cancellation workflows, treatment-specific prep/aftercare campaigns or follow-up/review request campaigns in this slice.
- Official public source checked: https://trippleswellnessspa.com/treatments and https://trippleswellnessspa.com/ . Published service and skincare-product prices are seeded in `src/lib/tripple-s/catalog.ts`; the owner can edit records in the admin catalogue. The public site does not currently publish named packages/prices, so no package pricing is fabricated.
- QA checkpoint is the pushed branch and exact SHA. Do not merge into `main` or deploy production/Firebase rules without explicit authorization.


### Product owner QA follow-up — hours and booking (2026-10-13)

- Sunday is **appointment-only**, not closed. Public booking must offer only real available Sunday appointment slots and state that the team must confirm the appointment. No Sunday walk-ins.
- Weekly hours, open/closed state, appointment-only days, time windows and dated public announcements are stored in the `settings/clinic` Firestore document and editable from Admin. Public hours/announcements are informational and booking preferences remain requests, not confirmed slots.
- Do not ask “How did you hear about Tripple S?” on the first booking form; remove that non-essential friction for now.
- New and returning clients must be able to submit a first request without an account. A customer account/history/perks feature must remain optional and use customer-scoped authorization; do not advertise specific rewards until Tripple S approves the benefit and rules.
- No production deployment, merge or Firebase rules deployment without explicit authorization.


### Product owner direction — simpler discovery, true availability and loyalty (2026-10-13)

- Homepage discovery: searchable treatment/concern field directly in the hero. Typing surfaces matching live seeded/admin-published services and direct booking links. Remove the extra category-card journey and long repeated explainer copy. Keep one concise hours summary; do not repeat seven days in the footer.
- Booking: free-form time input is not acceptable. Customers choose from available slots generated from selected service duration, admin-managed weekly hours, minimum notice, booking window and existing reservations. Never offer times outside hours or already-reserved intervals. Sunday remains by appointment according to admin settings. First booking remains guest-first.
- Schedule source of truth: distinguish a request from a confirmed appointment. A selected slot is atomically reserved while staff review it; declined/cancelled requests release it. Admin can create/edit/delete calendar blocks and appointments, which block overlapping public slots. Public availability responses contain no customer PII.
- Booking settings: hours, appointment-only days, temporary announcements, slot interval, minimum notice and advance-booking window are owner-managed.
- Loyalty and discounts: admin CRUD for percentage/fixed discounts, code, eligibility, active dates and visibility. Only active, in-date offers are public; discounts are validated server-side and snapshotted to the request. Account creation/linking is optional post-request onboarding; do not fabricate rewards or balances.
- Motion: small purposeful feedback only (search suggestions, slot selection and confirmation), respect prefers-reduced-motion, and never use fake scarcity/gamification.
- Research baseline: Google Calendar appointment schedules and Calendly availability guidance inform slot visibility/conflict avoidance; Xero supports simple loyalty offers. The Plug AGENTS.md is the reference for guest-first entry, optional durable accounts, real admin-published offers, truthful empty states and auditable incentives. Sources: https://support.google.com/calendar/answer/11608416, https://calendly.com/help/availability-overview, https://calendly.com/help/how-to-fine-tune-availability-settings, https://www.xero.com/za/guides/loyalty-programmes/, https://baymard.com/research-articles/delayed-account-creation, https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/AGENTS.md, https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/CLONING.md, https://github.com/gatshaayanda/the-plug/blob/docs/flagship-repo-audit-2026-10-12/docs/ADMIN-HUB-APP-FACTORY-SOP.md.

- Admin entrypoint naming: the public footer link, admin page label and protected sign-in heading use the single word **Admin**. Do not expose “Operations” as the user-facing title.


### Product owner direction — follow-up implementation checkpoint (2026-10-13)

**Keep the customer journey simple**
- The homepage search is the primary discovery action and must appear before any treatment/category list. Suggestions should link directly to booking with the selected service and published price/duration context. Keep only a small set of featured treatments below it; do not put category cards in front of search.
- Do not repeat the full weekly schedule in multiple places. The homepage visit section shows one compact, admin-derived hours summary; the footer should not repeat the schedule. The booking page explains that a chosen time is a request until the clinic confirms it.
- Use subtle motion only for search suggestions, available-slot selection and real offer cards. Respect `prefers-reduced-motion`; no fake scarcity, counters, rewards or gamification.
- The protected operations route is labelled **Admin**. The sign-in heading is one word, followed by “Sign in to start.” Metadata for the admin route must not say “Operations”. If a preview still shows the old label or free-form time field, first verify that preview's commit and URL before assuming the current source is running.

**Availability is a real slot system, not an optional time field**
- Customers must select a date and a slot returned by `GET /api/availability`; there is no free-form time input. The server independently validates dates, configured hours, minimum notice, advance-booking window, service duration, buffer, existing calendar entries and held requests before saving.
- The booking API atomically reserves 15-minute slot units in a Firestore transaction to stop two simultaneous requests taking the same time. Declined/cancelled/rescheduled requests release their holds; admin calendar entries use the same slot-reservation collection.
- Weekly hours, slot increments, minimum notice, advance-booking window, buffers and dated public announcements are editable under Admin → Hours & announcements. Calendar blocks handle date-specific holidays/closures; publish a dated announcement as the customer-facing explanation.
- Current scheduling is one shared capacity pool. Do not claim it coordinates multiple clinicians, rooms or equipment until the business supplies those resource/capacity rules and the model is extended. Slot selection and saved request are not the same as staff confirmation.
- Reject malformed calendar dates server-side; a regex alone does not establish that a date such as February 31 is real. Do not accept times just because a client has manipulated the UI.

**Offers and customer-account onboarding**
- Admin → Loyalty & discounts already provides CRUD for approved percentage/fixed-amount offers, code, eligibility (all/returning), active state and start/end dates. The server validates codes and snapshots an applied discount to the booking. Only active, in-date offers appear publicly. Do not seed imaginary rewards, points or discounts.
- Keep first booking guest-first and short. The intended next slice is an optional post-request account-linking invitation, following The Plug's delayed-account-onboarding principle: explain concrete benefits such as saved appointment history and cross-device access, then let the client opt in. Use Firebase anonymous auth followed by credential linking if the existing Tripple S auth/rules/configuration supports it; preserve the same UID and records, handle existing-account collisions explicitly, and never silently merge identities. Do not block booking on email, password, Google sign-in or installation.
- The account/history/linking workflow is **planned, not implemented or verified** in this checkpoint. Published offers are available now; additional loyalty membership or reward balances require explicit clinic rules and trusted records.

**Research and source-of-truth notes**
- The Plug was inspected at `docs/flagship-repo-audit-2026-10-12`: `AGENTS.md`, `AGENTS_REPO_LABELED.md`, `CLONING.md`, `docs/ADMIN-HUB-APP-FACTORY-SOP.md` and `docs/CLONE-RESET-CHECKLIST.md`. Its relevant reusable product patterns are guest-first start, delayed optional account linking, real admin-published offers with lifecycle/eligibility, concise copy, honest empty states, subtle reduced-motion-aware animation, and server-enforced access. Do not copy The Plug's business schema, branding, credentials, project IDs or private data into Tripple S.
- Booking research: Google Calendar appointment schedules explain availability and conflict-blocking; Calendly documents start-time increments, minimum notice, date ranges and buffers; Baymard's delayed-account-creation research supports keeping registration after the primary action. These are design references, not measured Tripple S conversion results: https://support.google.com/calendar/answer/11608416, https://calendly.com/help/availability-overview, https://calendly.com/help/how-to-fine-tune-availability-settings, https://calendly.com/help/how-to-use-buffers, https://baymard.com/research-articles/delayed-account-creation.
- Current source inspection identified and corrected an availability fallback duration parser that could misread legacy held requests, and added server-side real-calendar-date validation in both availability lookup and booking submission. Automated CI and preview readiness must be recorded separately from browser, real Firebase and device QA.

- **Clinic settings authorization:** Firestore rules allow public reads of the `settings/clinic` document but explicitly deny direct client writes. Admin changes must use `POST /api/admin/clinic-settings`, which verifies an authorized owner/staff bearer token and validates weekly hours, booking rules and announcement fields before writing through the server Admin SDK. Do not revert this to a browser `setDoc` call.


## Customer engagement and booking reliability checkpoint — 2026-10-13
- Treatment discovery is search-first on the landing page; the full Treatments page uses category browsing and must not repeat a second search field.
- Public product, treatment and general enquiries stay inside the app and are recorded as typed client requests in the authenticated admin queue. An enquiry receipt is not a booking or stock confirmation; the clinic must review and respond during operating hours.
- SUPERSEDED: an earlier checkpoint incorrectly treated Sunday as closed. Current rule: Sunday is open by appointment only; enforce that in defaults, public settings reads, settings writes, availability generation and final booking submission. Do not allow walk-in visits on Sunday.
- The availability endpoint depends on server-side Firebase Admin access to settings, appointments, booking requests and slot reservations. Never fabricate slots when that source fails. Verify the deployed `FIREBASE_ADMIN_KEY` and runtime logs if availability still returns 503; do not weaken Firestore read rules to work around the failure.
- Treatment duration remains owner-editable in Services; slot generation uses the published duration, clinic hours, notice/window, buffer and reserved/overlapping appointments. Booking submission rechecks the slot transactionally. Cancelled, declined or rescheduled requests release their reservations.
- Experience direction: calm editorial visual language, clear next steps, accessible enquiry modal, reduced-motion support, and minimal data collection. Do not add diagnostic claims or request sensitive medical details in enquiry forms.


### Product owner QA follow-up — live slot feedback (2026-10-13)

- Booking date copy must describe configured operating hours, not imply that a slot is available before the live calendar confirms it.
- If the availability API fails, do not fabricate or display times. Clearly state that availability could not be verified and that no appointment was booked; offer an in-place retry.
- Display the server's appointment-only note where provided. Slot options remain suggestions until the booking API transactionally reserves them, and the customer still receives a request rather than instant confirmation.
- If `/api/availability` returns 503 persistently, inspect the deployed Vercel function's `[Tripple S] availability lookup failed` runtime log and verify `FIREBASE_ADMIN_KEY` and Firestore access. This project integration could not currently retrieve those Vercel runtime logs; do not assume the root cause or weaken Firestore rules as a workaround.


### Current product-owner correction and reliability implementation — 2026-10-13

- **Sunday is appointment-only:** the default is open 08:00–17:00 by appointment, subject to owner-managed hours and actual slot conflicts. No walk-ins on Sunday. Other open days can accept walk-ins and appointments.
- Admin → Calendar supports Appointment, Walk-in visit and Blocked time entries. Each entry reserves the shared 15-minute slot units; overlapping public slots must be excluded. This is one shared capacity pool, not multi-clinician scheduling.
- If live availability or booking submission fails, never claim the request reached the clinic. Booking can be tested in an explicit local demo calendar; demo requests and admin CRUD are stored in this browser only and are not sent to Firebase or visible to staff on other devices. The enquiry fallback likewise states when it only saved locally.
- Live Firebase-backed enquiries and bookings require working server-side `FIREBASE_ADMIN_KEY`, correct project identity and Firestore access. Enabling Firebase Authentication providers alone does not configure the server Admin SDK. Inspect the Vercel function log and environment configuration; do not weaken rules to conceal a missing credential.
- Firestore public writes should pass through validated server routes using the Admin SDK. Client rules deny public booking-request writes and slot-reservation access; active catalogue reads are public, while all CRUD remains owner/staff-only. Deploy rules only after verifying the selected Firebase project and obtaining explicit authorization.
- **Firestore cost controls:** query only the selected date for appointments, held requests and slot reservations; use indexed equality filters; do not load entire booking/calendar collections for public availability; avoid frequent polling; cache public clinic settings/catalogue where safe; avoid duplicate reads; use transactions only for slot reservation and conflict-sensitive writes; review Firestore read/write and function invocation metrics before increasing refresh frequency. Configure budget/usage alerts where available. A 503 may indicate missing credentials, permissions, indexes or quota; inspect the actual error before diagnosing.
- **Account onboarding and sharing remain a separate implementation slice:** guest-first enquiry and booking must remain available. Any customer account, saved history, optional approved-offer announcements, and personal/share links must use explicit opt-in where marketing is involved, customer-scoped authorization and honest account-link collision handling. Do not imply these are implemented until verified.


### Product-owner correction — remove local demo booking/admin paths (2026-10-14)

- The customer booking flow must use only `GET /api/availability` and `POST /api/bookings` against the real Firebase Admin-backed calendar and booking records. Never generate browser-local appointment slots or save a request to localStorage as a fallback.
- Remove the public “Use local demo calendar” action and the Admin “Open local demo” access path. Admin CRUD must remain authenticated and persist to the live clinic data service.
- If availability or submission fails, show the actual server error message and a retry path; do not report a request as received unless the API confirms persistence. Local demo helpers are not an approved customer/admin workflow.
- The current production availability 503 root cause remains **unverified**. The Vercel runtime-log/environment connector calls returned project access/not-found errors, so do not assume missing Firebase configuration or claim the live calendar is fixed. Obtain the actual deployed function error and verify the correct production project/environment before making infrastructure changes.

## My Tripple S — product direction locked 2026-10-14

### Product promise
My Tripple S is the customer's ongoing care companion, not merely a booking receipt. The customer journey is Discover → Understand → Request a visit → Create/recover account access → Prepare → Attend → Follow up → Return. Every public page must provide an obvious route back to My Tripple S on desktop and mobile; customers must never have to start another booking to find their account.

### Intentional onboarding
- Make a lasting customer profile the normal guided path during the first booking/account journey. Explain concrete value: appointment history, next steps, preferences and relevant clinic updates.
- Reuse booking details already supplied; avoid asking for them twice.
- Do not equate a Firebase anonymous session with a recoverable account. Offer an explicit secure account-link/sign-in path, communicate limitations honestly, and preserve collision handling.
- Never silently merge histories or disclose one customer's records to another identity. Booking submission must not be falsely reported as confirmed; only an authorized staff status change may confirm.
- Keep booking available if identity-provider setup is unavailable; show a clear recovery path rather than losing a valid request.

### My Tripple S experience pillars
1. **My Care:** private appointment-request history, real statuses, clinic-authored preparation/aftercare and clear next actions.
2. **My Garden:** a calm, optional virtual garden that grows through customer-chosen gentle rituals. No punitive streaks, leaderboards, coercive reminders or implication that virtual growth measures health.
3. **My Journal:** optional personal reflections and self-chosen routine notes. Keep entries private to the authenticated customer by default, server-authorized by UID, bounded in size, and deletable. Do not turn this into an EMR or solicit sensitive medical details.
4. **Wellness Feed:** concise, trustworthy, low-pressure content and genuine clinic-published updates. Clearly distinguish general wellness prompts from clinic-approved aftercare. Do not fabricate offers, services, medical benefits or clinical advice.

### Privacy, clinical and engagement guardrails
- Wellness features are supportive, not diagnostic. No diagnosis, treatment recommendation, outcome prediction, invented health score, or claims that a garden/journal reflects clinical progress.
- Minimise sensitive data; explain what is saved and who can access it. Journal data must not be readable by staff/admin unless a future explicit, separately reviewed sharing feature is designed and consented to.
- Notifications, marketing, journal participation and wellness reminders are opt-in and independently controllable. No guilt, streak-loss pressure, fear-based beauty messaging or excessive nudging.
- Any shared-care/family feature must not collect another person's health/contact details without their permission.
- Only show active, published clinic offers. Never invent loyalty points, balances or rewards.

### Booking interaction
- Date/time selection should be compact on mobile (e.g. a disclosure/modal/bottom sheet) while retaining accessible controls and selected-time visibility.
- Available times must come from the live availability endpoint; do not invent fallback slots. Revalidate at submission, respect configured interval, service duration, buffers, opening/closing times and conflict checks.
- A booking request remains pending until the clinic reviews it and updates status. Never describe a request as confirmed on submission.

### Acceptance gates for this direction
- Persistent My Tripple S access is visible at mobile and desktop widths.
- Account history remains customer-scoped and Google/account collisions never silently merge identities.
- Garden/journal state is persisted server-side against the verified customer UID; unauthorized users cannot read/write another customer's data; entries can be deleted.
- Time selector is compact and keyboard/screen-reader usable; selection remains visible and existing live availability validation is unchanged.
- Feed content is truthful, low-pressure and clearly separated from clinic-published offers/aftercare.
- Run repository lint/build and inspect the diff before checkpoint. Report unavailable local/runtime verification honestly; a GitHub push or Vercel READY state alone is not proof of real customer behaviour.

### Appointment picker, notifications and Admin access follow-up (2026-10-15)

- Render live appointment availability in chronological order, grouped by hour. Slot values remain sourced from `GET /api/availability`; that endpoint must continue to honor admin-configured opening hours, slot interval, service duration, buffer, booking window and conflicts. Recheck on submission.
- Present appointment confirmations/status changes as the recommended notification use case. Keep marketing, published offers and clinic news as a separate opt-in. Never request browser notification permission without a clear customer action, and never claim push delivery while Firebase Web Push configuration is missing.
- Admin sign-in uses a single server-verified access word, following The Plug's operations-gate pattern; the word must be held only in the server environment as `ADMIN_PASSWORD`, never hardcoded in client code. The endpoint issues a Firebase custom token and authorization still depends on an owner/staff role record. Keep `FIREBASE_ADMIN_KEY` server-only. Configure the access word separately in the correct Vercel environments before testing sign-in; do not reuse The Plug's secret or credentials.


---

## Admin operations, availability and quota-aware usage — 2026-10-15

### Admin operating surface
- The authenticated admin surface must expose the actual operational workflows: request review/status/payment state, service CRUD, product CRUD, opening hours/booking rules/announcements, calendar entries and slot blocks, loyalty/discount CRUD, client contact records, follow-up reminders, review/feedback moderation, and aggregate usage insights.
- Admin screens must explain when an action is only an internal status/moderation flag. Do not imply that an internal review flag publishes content, that a follow-up sends a message, or that a payment status represents a real payment gateway.
- Keep list reads bounded. Current request, client, follow-up and feedback views load at most 100 records; if volume grows, implement cursor pagination rather than removing limits or using Firestore offsets.
- Keep client records operational and minimal. Do not add diagnosis, suitability decisions, prescriptions, or unnecessary clinical information.

### Canonical slot reservations
- `slotReservations` is the canonical occupancy index: booking requests and calendar entries reserve every overlapping 15-minute unit (including configured treatment duration and buffer) in a transaction.
- Public availability must derive blocked times from these reservation locks plus admin-configured clinic settings. Do not scan all booking requests or appointment documents for each date-picker interaction.
- Booking submission must revalidate by checking every required reservation lock inside a transaction. A request is not a confirmed appointment; requests remain pending clinic review.
- Declined, cancelled and rescheduled requests must release their reservation locks. Removing/editing a calendar entry must keep its lock records synchronized. Never show a locked slot as available to improve conversion.
- If legacy/orphan locks are discovered, inspect and reconcile them deliberately; do not make all stale locks invisible in the public query because that can reintroduce double-booking.

### Privacy-conscious customer-journey measurement
- The public app may record aggregate daily counts for page views by broad route category, approximate browser-tab sessions, source category (direct/search/social/referral), coarse device class, booking starts, availability checks/empty results/errors, successful request submissions, slot conflicts and enquiries.
- Never send or store names, phone numbers, emails, appointment dates/times, selected treatments as user-level telemetry, clinical information, raw referrer URLs, URL query strings, IP addresses, or stable user identifiers in usage analytics.
- Admin routes are excluded. Analytics failures must never block the customer journey. The daily `usageDaily` aggregate is for directional funnel insight, not a precise people count, clinical measure, revenue report or substitute for Firebase's actual usage metrics.
- An “estimated session” is a tab-scoped browser session estimate, not a verified unique person. Counts begin only after the tracking version is deployed; do not backfill or fabricate earlier traffic.
- Keep analytics event names and dimensions allow-listed server-side. Public telemetry is an untrusted signal; never use it for authentication, billing, clinical decisions or access control.

### Quota and performance rules
- Firestore free-tier reference: 50,000 document reads/day and 20,000 writes/day for a qualifying database; verify current quota and actual Firebase project before forecasting. Official source: https://firebase.google.com/docs/firestore/pricing
- Prefer one bounded date query over reading multiple whole collections; use query limits and cursors; avoid offsets and realtime listeners unless a real-time workflow needs them. Official guidance: https://firebase.google.com/docs/firestore/best-practices
- The admin usage dashboard reads only daily aggregate documents for the selected 7/30-day window. Each tracked event uses one aggregate document write; keep event instrumentation purposeful and review Firebase's usage dashboard alongside app funnel metrics.
- Firestore aggregation queries can reduce data returned compared with reading full records; they still consume index reads. Official source: https://firebase.google.com/docs/firestore/query-data/aggregation-queries

### Evidence-led booking experience
- Keep date, service duration, opening hours, slot interval, buffer, booking window and reservation locks consistent between the admin settings, public picker and booking POST validation.
- Show slots in chronological order, make unavailable/empty/error states distinguishable, preserve a clear human review step, and explain that a request is not confirmed until Tripple S confirms it.
- Do not assume “fewer choices is always better.” Choice-overload research finds effects depend on complexity and context; keep the selection task understandable, group times chronologically and surface the information needed to choose without inventing recommendations. Background review: https://pubmed.ncbi.nlm.nih.gov/38784631/
- Online appointment booking research identifies ease of use, reliable access to suitable slots and clear alternatives as important to adoption; preserve a human contact route for clients who prefer it. Study: https://pmc.ncbi.nlm.nih.gov/articles/PMC11263895/

### Current implementation checkpoint
- Admin routes: `/admin`, `/admin/calendar`, `/admin/loyalty`, `/admin/clients`, `/admin/followups`, `/admin/reviews`, `/admin/usage`.
- Usage instrumentation intentionally starts from deployment; empty historical metrics are expected.
- Verify TypeScript, lint, production build, deployed API behavior, booking conflicts/cancellation and real Firebase reads/writes before describing this slice as fully verified.


---

## Booking journey and account-completion loop — 2026-10-15

### Public appointment request order
- The booking form order is: **01 What brings you in? → 02 When works for you? → 03 How can we reach you?**
- Treatment/consultation choice precedes date selection; date selection precedes the available-time picker. Keep times chronological and sourced from the live availability endpoint.
- Keep name and WhatsApp/mobile required so the clinic can respond. Do not ask for email as a separate required or optional field in the booking form; email can be obtained from a connected Google identity after the request.
- A blank treatment means “Consultation / help choosing”; it does not mean a clinical decision has been made. The clinical team decides suitability.
- A valid appointment request still needs a date and available time, even when the customer asks for help choosing. Never imply a requested slot is confirmed.

### Closed-loop account setup
- Guest booking remains available and must not be blocked by account creation.
- After a request is recorded, the success screen should clearly invite the customer to secure their My Tripple S profile with Google, so history is easier to find. Preserve the booking reference and offer a way to continue without immediate account setup.
- Linking Google to the existing anonymous Firebase identity should preserve that identity. After a successful link, sync the verified email to up to 20 booking requests for that customer and set `profileConnected`; this lets the staff queue recognise profile completion.
- If an existing Google identity cannot be linked and the customer signs into a separate identity, do not silently merge booking histories. Explain the limitation and retain the booking reference as the recovery path.
- In the admin appointment detail, show whether the profile is connected. If not, staff should invite the customer to complete setup during human follow-up; do not claim an automated reminder was sent.
- The customer profile sync endpoint may update at most 20 requests associated with that verified UID, avoiding a composite-index dependency. Keep profile-sync operations authenticated, bounded and separate from public analytics.
- Booking requests are still pending clinic review until staff explicitly changes status. Profile completion, email association, slot reservation and appointment confirmation are distinct states.

### Privacy and operational constraints
- Use the email claim from the verified Firebase ID token, not an arbitrary client-supplied email, when syncing the connected profile.
- Store only operational contact details required for the customer journey. Do not collect medical history or sensitive clinical details in this flow.
- Test both Google-link success and failure, including a provider already linked to another UID, blocked popups, unauthorised domains and retry behaviour. Do not promise that existing separate account histories are merged.
- QA acceptance: verify section order; date → live times; no manual email field; guest request works; success CTA leads to account setup; Google linking syncs email/profile state; Admin reflects connected vs not-yet-connected; request remains pending until staff review.


---

## Booking/profile QA checkpoint and deployment retry — 2026-10-15

- The booking journey changes are committed on `main`: treatment/help choice → date and live available time → customer name/mobile → submit. There is no manual email field in the booking form.
- After a guest request is successfully recorded, the customer can continue to My Tripple S and link Google. Profile sync uses the verified identity and is bounded to at most 20 requests for that UID. The admin request detail must distinguish a connected profile from one that still needs follow-up.
- Keep guest booking available. Do not merge separate Firebase identities or claim profile sync succeeded if its API call failed. Requests remain pending until staff explicitly reviews and confirms them.
- QA remains outstanding: opening-hour/interval/duration boundaries; request creation and pending reference; unavailable-slot conflict and cancellation/release; Google link success/failure and profile sync; Admin connected/not-connected indicators; and authenticated Admin CRUD/usage views.
- Latest observed GitHub main checkpoint before this note: `c01335fc3ca92d98ee0bb0a92056a469b7cf3386` (`chore: retry Vercel deployment after build rate limit`). Its Vercel check reported `failure` with a build-rate-limit URL. Do not assume the latest source is deployed or live-QA-ready until a later deployment for the current main SHA succeeds and is accessible.
- Vercel deployment listing is currently blocked by missing team authorization in the connected Vercel tool. The live app fetch previously returned HTTP 403 access denial. Do not claim runtime QA has been executed; resolve Vercel team access and confirm a successful deployment before live testing.
- Avoid documentation-only or repeated retry commits unless the product owner explicitly requests another deployment attempt. Batch verified changes, then push once.


---

## Availability and reception onboarding refinement — 2026-10-15

### Availability integrity
- Availability must calculate treatment duration in minutes, supporting values such as `60 min`, `1 hour`, or `1 hr 30 min`; do not parse the first number in a duration label as the full duration.
- A slot reservation is occupancy only while its owning booking request or calendar entry exists and remains active. Ignore orphaned locks and locks owned by cancelled/declined/rescheduled requests when calculating public availability. The booking POST transaction must continue to validate locks against current owner state and must not accept a conflicting active booking.
- The picker must render each time as a distinct, accessible button with visible spacing; sort times chronologically and group by start hour. Starts advance by the configured interval, and the full treatment plus buffer must fit before closing. Never fabricate times when the API errors.
- QA priority: on a known empty future date, verify a 60-minute service produces each valid configured start (e.g. every 15 minutes from opening through the last start that can finish by closing), then verify active reservations block overlapping starts while orphan/cancelled locks do not. Verify 45-minute and 30-minute services too.

### First-visit and returning-client reception
- `clientType` is an operational reception cue, not a clinical label or marketing segment. Show it clearly in Admin and provide a short next-step prompt.
- First visit: warmly introduce Tripple S, explain the request/review process, and use only information the client voluntarily provided to make the interaction comfortable. Ask open, low-pressure questions when appropriate; do not interrogate or require personal disclosure.
- Returning client: welcome them back naturally, review documented history and operational notes before contact, and reference a prior preference/detail only if it is recorded, relevant, and appropriate. Ask what they want from this visit rather than assuming their goals or circumstances.
- Booking note is optional and request-specific. For first visits, invite only lightweight context such as how they heard about the clinic or what would help them feel comfortable; for returning clients, invite a practical preference or current focus. Do not ask for family details, origins, or sensitive medical information as a routine onboarding requirement. Never invent familiarity. Keep the clinical team responsible for clinical suitability.
- Keep existing account holders account-first: a connected Firebase customer who opens `/book` sees a clear route to My Tripple S, with an explicit option to start a new request. Account page booking links use the explicit `newBooking=1` intent so the customer can intentionally enter the new-request form. Guest booking remains available without login.

### Evidence and design rationale
- Personalisation can improve engagement but can also raise privacy concerns; use transparent, purpose-limited notes rather than broad personal profiling: https://onlinelibrary.wiley.com/doi/10.1111/exsy.70314 and https://www.sciencedirect.com/science/article/pii/S0736376116000094
- A two-stage disclosure study found that privacy assurance and explaining the purpose of personalisation affected willingness to share information; therefore the booking note is optional, purpose-explained, and low-pressure rather than a required questionnaire: https://www.sciencedirect.com/science/article/pii/S0148296320301004
- Research on reactive personalisation in hospitality suggests responding to stated customer preferences can support trust and perceived ownership; apply this through documented, client-supplied preferences rather than guessing: https://www.sciencedirect.com/science/article/abs/pii/S1447677025000762
- These studies inform interaction principles, not a guarantee of increased bookings or retention. Avoid claiming causal business outcomes without Tripple S data.

### QA status discipline
- The previous visual check of the booking section order is recorded as PASS by the product owner.
- Live availability, request submission/conflict handling, Google/profile sync, and Admin workflow tests remain NOT RUN / N/A until the correct updated deployment is available. Do not mark them passed from source inspection alone.
- This checkpoint is a scoped implementation candidate; inspect the diff and run TypeScript, lint, build and live QA when tooling/deployment access permits. Avoid unrelated UI, catalogue, clinical, notification, or infrastructure changes.


---

## Supplied treatment catalogue reconciliation — 2026-10-15

- The eight headings and treatment names/prices supplied by the product owner are the source of truth for the public catalogue. Do not retain obsolete built-in seeded services after the one-time catalogue migration.
- Admin can create, rename, reorder, publish/unpublish and delete empty treatment categories. Renaming a category updates its existing treatments. A category with assigned treatments cannot be deleted until treatments are moved or removed.
- Admin can create/edit/delete treatments, set their category, price, duration, description, assessment note and visibility. Categories are Firebase-backed in `serviceCategories`, not stored in Sefalana's browser-local demo pattern.
- The explicit “Sync supplied treatment list” action performs a one-time migration: update built-in seed IDs to the supplied names/prices, remove only known obsolete built-in seed IDs, add missing categories/products, and preserve unrelated custom records. After version 2 is recorded, later syncs only add missing seed records and must not overwrite later Admin edits.
- Prices use the exact supplied values; variable prices use “from P…”. Repeated offerings under separate headings remain separate catalogue entries as supplied.
- Durations were not supplied. Matching known treatments retain existing durations; other entries receive an explicitly provisional 30-minute duration and an Admin note. Before appointment availability QA or production booking, the clinic must replace provisional durations with confirmed durations. Do not represent provisional values as clinic-approved.
- Advanced medical aesthetics retain the supplied practitioner/legal-authorisation caveat. The software does not determine clinical suitability or legal authorisation.
- QA state: source changes need TypeScript/build and Firebase/deployed CRUD verification. Do not mark migration safety, category persistence, treatment prices or customer rendering as PASS until executed.


---

## Admin care-desk UX direction — 2026-10-15

### Product intent
The authenticated workspace should feel like a calm, premium extension of the public Tripple S experience—not a generic back-office table. Staff should be able to acknowledge, review and progress requests with minimal navigation on both desktop and mobile. Preserve existing Firebase ownership, authentication, request/status/payment flows, catalogue CRUD, clinic settings, and linked admin routes unless a separately verified defect requires change.

### Daily workflow priorities
- Make the Requests queue the first operational landing surface.
- Let staff search by client name, phone, treatment/item, status, or preferred date, and filter All / New / Appointments / Enquiries without changing persisted records.
- Keep the request details, status controls, payment controls (appointments only), and call/WhatsApp actions available.
- Clearly remind staff that a request is not confirmed until the clinic completes its process.
- Use short, humane client-care prompts: acknowledge the request, avoid assumptions, protect privacy, and refer suitability/clinical decisions to the clinic team. Never imply that software or reception staff can decide clinical suitability.
- Use clear feedback, visible focus states, touch-friendly controls, and responsive layouts. Avoid tiny controls, horizontal page overflow, and long dense blocks on mobile.
- Keep infrequent maintenance tasks out of the primary daily flow. The one-time/reconciliation “Sync supplied treatment list” control is not part of routine clinic operations and should not appear beside normal treatment CRUD. Use “Add treatment” and individual edit/visibility controls for normal catalogue management. Do not run reconciliation automatically or change seeded/catalogue data as part of this visual refresh.
- Keep the internal reconcileTrippleSCatalogue() implementation untouched unless a separate catalogue-migration task explicitly requires changes. Removing its UI control does not remove the function or perform any Firebase writes.

### Evidence informing the design
- Nielsen Norman Group, “Progressive Disclosure” (2006): show the most important/frequently used actions first and defer infrequent/advanced tasks, while making secondary actions discoverable: https://www.nngroup.com/articles/progressive-disclosure/
- Nielsen Norman Group, “Website Forms Usability: Top 10 Recommendations”: group related controls, use clear labels, and favor a simple vertical flow especially on small screens: https://www.nngroup.com/articles/web-form-design/
- Merriweather et al., *npj Digital Medicine* (published 14 January 2026), survey of 564 physicians across 32 specialties: system usability and alignment to workflow were associated with reduced extraneous cognitive load; information overload partially mediated effects: https://www.nature.com/articles/s41746-025-02243-4
- Rivera-Rodriguez & Karsh, *BMJ Quality & Safety*, “Interruptions and distractions in healthcare: review and reappraisal”: interruptions are common in care settings, so the interface should make status, context, and the next action easy to recover after an interruption: https://qualitysafety.bmj.com/content/19/4/304
- These sources inform design hypotheses, not proof of outcomes for Tripple S. Validate them with staff usability checks on real phones and desktops.

### Acceptance criteria for admin UX changes
1. The daily Requests queue opens by default and still loads the same request data.
2. Search and filters affect only the visible queue; clearing filters restores the list.
3. Existing request selection, status changes, appointment payment updates, call/WhatsApp links, and catalogue/settings actions remain intact.
4. No routine catalogue sync button is shown; treatment add/edit/delete and visibility controls remain available.
5. Responsive layout remains usable at narrow mobile widths and desktop widths; controls are keyboard-focus visible and labels are understandable.
6. Client-care guidance is supportive, privacy-conscious, non-diagnostic, and does not claim appointment confirmation or clinical suitability.
7. Run TypeScript, lint, and production build; inspect the diff. Then perform runtime QA for queue search/filtering, status/payment persistence, CRUD persistence, and mobile layout. Source changes alone do not prove those runtime behaviors.


## Treatment image uploads — 2026-10-15

- Treatment records use the existing optional `imageUrl` field. The authenticated Admin treatment editor must upload image files through UploadThing rather than requiring staff to paste a URL, while retaining the saved URL for existing/manual records.
- Reuse The Plug's UploadThing v7 integration pattern. Upload middleware must validate the request using the existing server-side `requireAdmin` Firebase ID-token/role check; do not trust client-side AdminGate alone.
- Limit treatment uploads to one image per upload, image MIME types, and 4 MB. Surface progress/errors, preview the selected image, support replacing and clearing the image URL, and only persist catalogue changes when staff explicitly saves the treatment.
- Render a saved treatment image on the homepage treatment cards, the public treatment menu, and the treatment detail page. Keep a graceful existing placeholder where no image is assigned; do not require images for publishing.
- Acceptance evidence still required: dependency lock/install, TypeScript, lint, production build, unauthenticated upload denial, authorized upload success, save/refresh persistence, replacement/removal, public page rendering, and mobile layout. Source edits alone do not constitute runtime or deployed verification.


## Catalogue editor UX checkpoint — 2026-10-15

- Treatment, treatment-category, and product create/edit forms belong in a centered, responsive modal rather than being appended below the catalogue list.
- Modal content scrolls internally on desktop and mobile; Escape, close control, and backdrop close dismiss the editor without saving. Body scrolling is locked while the modal is open.
- Catalogue save outcomes use a visible status toast. Treatment image upload shows a thumbnail/empty state, replacement/removal controls, and upload progress percentage.
- Keep UploadThing staff authorization and the 4 MB image limit. A selected image URL is persisted to the catalogue only when the corresponding record is saved.


---

## Customer discovery, first-visit vs returning-client journey — 2026-10-16

This is an additive improvement to the existing product. Preserve the working homepage, treatment catalogue, appointment validation/availability, request persistence, request reference, account features, Admin queue, and status/confirmation boundary. Do not replace working flows wholesale; inspect the exact current implementation and retain a rollback-friendly, minimal diff.

### Product discovery
- Make treatment discovery easy from the homepage: prominent search, visible links to actual active catalogue categories, curated starting points, and a clear consultation path for customers who do not know what they need.
- Search is for finding and comparing options, not silently selecting the first match or submitting a booking. Show matching treatments with published price/duration and clear view/request actions.
- Category navigation must use the real Admin-managed active categories and lead to correctly filtered treatment listings. Keep an “All treatments” path and visible selected-filter state.
- Reduce competing homepage sections without deleting useful clinic information, products or genuine published offers. Prioritise understanding the treatment range and the next action.
- Treat Baymard's homepage/category/search research as UX guidance, not a claim that this clinic's own conversion or usability has been measured.

### First visit vs returning client vs authenticated account
These are three distinct concepts; do not conflate them:
1. **First visit** is a customer-reported care/visit history choice, not an authentication state.
2. **Returning client** is a customer-reported visit history choice and may affect eligibility for an explicitly published offer. It does not prove that the customer is signed in or identify their previous requests.
3. **Signed-in customer** is a verified Firebase identity. Their existing account/history should be reused; they must not be treated as a new guest or sent through onboarding again.

### Required appointment flow
- A customer can browse and submit a first appointment request as a guest. Do not require account creation, Google, email, password or PWA installation to request a visit.
- For an unauthenticated first-time guest: capture the minimum necessary contact/appointment details; persist the request; show a clear success state with its reference and “request received / pending clinic review” wording; then offer optional account securing/linking so history is easier to find later.
- For a customer already signed in to My Tripple S: selecting “Request this treatment” or “Request another visit” must continue directly into a prefilled new request flow. Do not show a gate that says “Your My Tripple S account comes first” and require the customer to navigate to the account page, then start over. Preserve the selected treatment and authenticated identity; prefill known name/phone/email where available, allow editing, and do not ask the customer to authenticate again.
- For a returning client who is not signed in: let them request as a guest, with a clear option to sign in to an existing account before submitting if they want their history attached. Do not imply the “Returning client” choice alone retrieves or links old history.
- After successful request submission by an already authenticated customer, show the request reference and next steps, and refresh the account's request history so the new request is visible. Do not route them through first-time Google setup.
- When a guest later secures their profile, preserve the original request reference and link history only through a verified, secure ownership/linking process. Never silently merge two Firebase identities or expose another account's bookings. If Google belongs to an existing account, explain the identity/history limitation and provide a safe recovery/linking path rather than claiming that histories were merged.
- Avoid duplicate submissions on refresh, back navigation or repeated taps. Retain the server's validation, transactional slot reservation, error handling, and status semantics.
- A request is not a confirmed appointment. Keep “request received”, clinic review, confirmation and payment states distinct.

### Account and security requirements
- Keep My Tripple S customer features and existing private journal/garden data working while fixing booking continuity.
- Customer booking history must be read from server-verified identity and must not be exposed by a client-supplied UID or contact details alone.
- Review the authenticated account's relationship to the `/api/bookings` and `/api/customer/bookings` paths. Ensure newly submitted bookings are attached to the correct verified UID and immediately appear in that same account.
- Do not weaken Firebase rules, customer identity checks or Admin authorization to make onboarding easier. Do not delete guest requests or overwrite unrelated client history during account linking.
- Preserve separate Admin access and customer access. Customer sign-in must never grant Admin privileges.

### Acceptance criteria
1. From a treatment page, an unauthenticated customer can request a visit and receives one saved request, a reference, and honest pending-review wording.
2. After that guest request, optional Google account setup is offered; declining it does not lose the request.
3. A signed-in customer selecting a treatment reaches the request form with that treatment selected, without an account-first blocking screen or a second login/onboarding step.
4. A signed-in customer can submit another request with known contact fields sensibly prefilled; the request is saved once against their verified UID and appears in My Tripple S history without restarting the journey.
5. First visit / returning client selection remains a visit-history declaration and is not used as a substitute for authentication.
6. An unauthenticated returning client can continue as a guest or explicitly sign in; no false promise is made that prior history is automatically recovered.
7. Guest-to-account linking preserves request history only after verified ownership; existing-account conflicts are handled without silent account merging or data loss.
8. Existing availability/slot conflict checks, booking reference, treatment/price/duration snapshots, admin queue, and request-versus-confirmation wording continue to work.
9. Search/category discovery changes do not remove active services, Admin-managed content, or existing working navigation.
10. Run TypeScript, lint and production build; inspect the diff; test customer journeys, authenticated/guest separation, duplicate-submit protection, and account history. Mark real Firebase/deployed/device tests NOT RUN unless actually executed.


## Customer contact continuity fix — 2026-10-16

- The booking form hydrates authenticated customers from their verified Firebase identity and the UID-scoped `/api/customer/profile` endpoint. Saved profile details take precedence over Google provider name/email so customer corrections persist; Google does not supply WhatsApp/mobile numbers.
- `GET /api/customer/profile` requires a verified customer token and returns only that UID's saved profile plus a fallback to their own recent booking details. Responses are private/no-store.
- Every authenticated booking transaction stores the submitted name, phone, and available email in that same UID's `customerProfiles/{uid}` document alongside the booking. Guest booking remains available; customer history is not merged across Firebase UIDs.
- Acceptance criteria: signed-in customer sees known contact fields prefilled; saved name/phone/email survive subsequent visits; first authenticated booking seeds the profile; guest requests still work without authentication; profile reads reject missing/invalid tokens; booking history and slot transaction semantics remain unchanged.
- Verification status: source changes only until CI and real authenticated Firebase/deployed flows are executed. Do not claim live profile persistence from source inspection alone.


---

## Admin deletion confirmation and bulk pricing — 2026-10-17

### Destructive actions
- Treatment, product and permitted category deletions require a record-specific confirmation modal before any delete call. The dialog names the item, explains that the action cannot be undone from the screen, and offers a non-destructive cancel/keep action. Never preselect deletion.
- Disable duplicate delete submissions while an operation is pending. Update the visible list only after persistence succeeds and report failures without pretending the record was removed. Preserve category dependency checks and historical booking/payment snapshots.

### Bulk catalogue pricing
- Preserve individual price editing. Treatments and products also support an explicit bulk price update workflow with individual selection, select/clear visible items, and category filtering for treatments.
- Supported operations: set an exact price, increase/decrease by a fixed amount, or increase/decrease by a percentage. Display current and proposed prices for every item before applying changes. Use Botswana pula formatting and reject negative or invalid outcomes.
- The user explicitly selects the records to change and confirms after reviewing the preview. Filter changes reset selection so a hidden selection cannot be accidentally included. Bulk writes run per record; accurately report partial failures and update local state only for successful writes.
- Bulk catalogue price updates must not rewrite existing booking price/service snapshots or payment records. The clinic owner remains the authority on approved prices; the application calculates changes but does not prescribe prices.

### Acceptance criteria and evidence
- Test keep/cancel and confirm deletion for treatments, products, and empty categories; test busy/duplicate clicks, failed deletes, and category dependency restrictions.
- Test bulk selection, category filtering, selection reset, exact price, fixed amount, percentage changes, rounding, invalid/negative values, zero selected records, partial persistence failures, and ensuring unselected records remain unchanged.
- Verify booking snapshots and payment records remain unchanged after catalogue edits.
- Run TypeScript, lint, production build, inspect the diff, and then perform authenticated Firebase/deployed and mobile QA. Source changes alone do not prove runtime persistence. Record any unexecuted checks as NOT RUN.


## Admin catalogue navigation and pricing — acceptance criteria
- Treatment catalogue is searchable by name, category and description, filterable by category, and paginated in groups of 12; changing search/filter resets to page one and empty results provide a clear-filters action.
- Product catalogue is searchable and paginated in groups of 12 with a clear-search action for empty results.
- Bulk price update is visibly labeled **Bulk update prices** in both Treatments and Products. It remains preview-first, selection-based, and must not modify historical booking snapshots.
- Treatment editor keeps core fields visible while assessment, preparation and aftercare fields are grouped under a collapsed optional section.
- Verify on mobile and desktop: search, category filter, page controls, modal entry/cancel, selected bulk price preview, persistence failures, and no changes to unselected records.


## Public catalogue price consistency — acceptance criteria
- In legacy catalogue compatibility mode, public service loading overlays saved active Firestore records onto matching seed records by document ID. Saved prices and other saved fields must win over seed defaults; missing seed records retain the existing fallback behavior and custom records remain included.
- Public landing-page search and treatment listings must reflect a successful admin price edit/bulk price update without requiring a catalogue migration or changing historical booking/payment snapshots.
- When public client code changes, increment the service-worker shell cache version so installed PWAs can fetch updated JavaScript rather than reusing stale cached bundles.
- QA: update one existing seeded treatment price through admin bulk pricing; verify the saved price in Admin, the landing-page treatment search result, and the full treatment menu after refresh and in an installed PWA. Verify unselected treatments are unchanged.


## PWA hardening checkpoint — 2026-10-17

- Keep the current Tripple S product and customer/admin workflows as the golden baseline; PWA work stays isolated on a QA branch until explicitly approved.
- The service worker must never cache `/admin`, `/account`, `/api/*`, or dynamic Next.js data. Only cache explicitly public home/treatment/booking/offline pages, public assets, and fingerprinted `/_next/static/*` assets.
- Never use private admin HTML as an offline fallback. Offline messaging must distinguish previously loaded public content from appointment requests actually received by the clinic.
- Capture `beforeinstallprompt` before React hydration, invoke the native prompt directly from the Install button when available, and show platform-specific guidance only when the native prompt is unavailable or dismissed. Website use must not require installation.
- Detect common social embedded browsers and provide an external-browser handoff that preserves the current URL, plus a copy-link/manual fallback. This is not proof of successful handoff on every device.
- Service-worker updates wait for user confirmation before replacing an already active worker; show an explicit refresh action rather than silently reloading a customer mid-flow.
- Acceptance gates: TypeScript, lint, production build; inspect manifest/icon requirements; verify service-worker cache contents and private-route exclusion; test native install prompt, dismissed/unavailable fallback, embedded-browser handoff, update activation, offline public browsing, online-only booking receipt, and Android/iOS real-device behavior. Mark unexecuted integration/device checks NOT RUN.
