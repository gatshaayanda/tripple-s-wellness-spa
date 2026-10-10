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


## Golden system — WhatsApp → normal browser → PWA install
The PWA journey is a single root-level controller, separate from customer page components:
- Early install-event capture: `public/pwa-install.js`, loaded with Next Script `beforeInteractive` from `src/app/layout.tsx`. It retains `beforeinstallprompt` on `window.__trippleSPwa` and emits `tripple:pwa-installable`; it owns the one `appinstalled` listener and emits `tripple:pwa-installed`.
- Root state/UI controller: `src/app/pwa-register.tsx`. Do not add route-level install prompts, duplicate event listeners, alert dialogs, or a second PWA controller.
- Styling: `src/app/pwa.css`.
- Manifest metadata: `src/app/manifest.ts` and `public/manifest.webmanifest`; keep these outputs aligned.
- Service worker/cache: `public/sw.js`; bump the Tripple S cache namespace when changing shell assets and keep the early install-capture script in the shell cache.
- WhatsApp and supported in-app browsers are the **escape stage**. The branded gate offers one platform-aware primary action, preserves the current pathname/query/hash, and provides copy/menu fallback guidance if the host app cannot launch an external browser. The `__external_browser=1` marker is stripped after arrival in a non-embedded browser; it must not suppress the gate if the destination still identifies as an embedded browser.
- Normal browser is the **install stage**. Keep the branded Install action available unless installed/standalone or on `/admin` or `/account`. If the native event exists, the install button calls its retained `prompt()` directly from the click gesture. If unavailable or the prompt errors, show platform-specific instructions (Android Chrome menu, iOS Safari Share → Add to Home Screen, desktop Chrome/Edge install menu). Never claim the native prompt opened unless it did.
- Do not auto-open the install help panel. Do not show the install promotion over the embedded-browser gate. Handle `appinstalled` by suppressing installation UI.
- Browser/OS eligibility cannot be forced from JavaScript. Investigate HTTPS, manifest name/start URL/scope/display/icons, service-worker registration/scope, event timing, and browser diagnostics when native install is unavailable. Current project icon asset is `public/icon.svg`; do not declare missing raster icons as though they exist.
- The browser handoff must preserve the current destination route; avoid redirects to `/` and loops. Android uses a Chrome intent with an HTTPS fallback URL; iOS uses the Safari URL scheme where supported. Browser host behavior varies, so always keep a visible fallback.
- Verification checklist for each change: inspect root controller and all event listeners; inspect actual manifest response, icon paths, and service-worker scope/cache; test embedded-browser gate and external handoff separately from normal-browser install; test native event and missing-event fallback; test standalone/appinstalled suppression; verify direct route entry and route preservation; run `npx tsc --noEmit`, `npm run lint`, `npm run build`; inspect exact pushed commit and Vercel deployment before claiming QA-ready. GitHub CI is not a substitute for real-device handoff/install testing.
