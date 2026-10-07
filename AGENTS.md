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