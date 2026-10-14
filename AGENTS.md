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


---

## Product-owner hard requirements — real customer operations (2026-10-14)

This section supersedes earlier implementation notes that allowed browser-local demo fallbacks in customer booking or enquiry flows.

- The public appointment calendar is the real shared Tripple S calendar, backed by the same Firebase/Firestore records used by Admin. Public availability must account for configured clinic hours, service duration, booking rules, held booking requests, slot reservations, admin appointments, walk-ins and blocked time.
- Never offer a customer a local demo calendar, generated sample slots, or browser-local calendar as a substitute for live availability. If the shared calendar cannot be read, show a retry/contact path and do not offer times.
- Never convert a failed booking/enquiry POST into a successful-looking browser-local receipt. A request is received only after the server confirms that the record was persisted to the shared database. On failure, state plainly that it was not recorded and offer retry/contact.
- Browser localStorage must not be treated as the operational database for appointments, enquiries, clients, calendar entries, services, products, payments or offers. The Admin interface must use shared Firebase data; local demo mode is not a substitute for owner/staff operations.
- Seed the approved official Tripple S catalogue and default clinic settings into the real shared database through an explicit, idempotent admin workflow. Seed data must remain editable in Admin and must never overwrite existing owner edits on every page load.
- The /admin route has the single-word heading Admin and supports the owner's server-verified ADMIN_PASSWORD from Vercel without requiring an email on the default sign-in path. The password must never be exposed to browser JavaScript. Server login must issue a Firebase custom token only for a provisioned owner record; all existing role checks and protected data paths remain in force. Keep a separate email/password path for individually provisioned staff accounts.
- A valid build or pushed commit is not proof that live Firebase is working. Verify the real availability endpoint, successful persisted booking request, shared Admin visibility, conflict rejection, and enquiry persistence against the actual deployment before calling the customer journey ready. If runtime access is blocked, report the precise blocker and do not fabricate verification.
