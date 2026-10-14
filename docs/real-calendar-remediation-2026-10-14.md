# Tripple S real-calendar remediation — 2026-10-14

## Authorized scope
- Remove browser-local demo availability and local-only success fallbacks from public appointment and enquiry forms.
- Use the shared Firestore-backed availability and booking APIs as the only customer booking path.
- Add server-side ADMIN_PASSWORD login at /admin, preserving individually provisioned staff email/password login and owner/staff role checks.
- Record the non-negotiable real-customer-data rule in AGENTS.md.

## Source inspection findings
- GET /api/availability and POST /api/bookings already read/write shared Firestore collections and reserve slot units transactionally.
- The public booking form nevertheless allowed a browser-only demo calendar and wrote failed requests to localStorage, displaying a local-only receipt. The enquiry form had the same local-only fallback.
- /admin previously required email/password and exposed an Open local demo path that switched Admin data operations to browser storage.
- Vercel project metadata lists FIREBASE_ADMIN_KEY and ADMIN_PASSWORD environment-variable entries, but this connector did not return their decrypted values. Vercel runtime log access returned 403, so the underlying production 503 cause is not yet verified.

## Changes in this checkpoint
- Public booking only displays server-returned slots. Failed availability checks provide retry/contact options, never demo times.
- Public booking/enquiry receipts appear only after a successful server response; failure leaves the form available to retry and clearly states the request was not recorded.
- Owner can enter /admin with the server-only ADMIN_PASSWORD; server checks the password and returns a Firebase custom token only for an existing Firestore owner record. Staff retains email/password sign-in.
- Removed the Admin local-demo bypass from the sign-in UI, disabled local demo mode centrally, and clear legacy browser flags before Admin data components mount.
- Added standing operating rules to AGENTS.md.

## Verification status
- Source transformation checks: PASS (no local-demo references remain in the public booking/enquiry UI; no local-demo entry point remains on the Admin sign-in screen).
- TypeScript, lint, production build: NOT RUN in this connector-only environment.
- GitHub CI on the new branch: NOT RUN at checkpoint creation.
- Production API/runtime, Firestore persistence, shared Admin visibility, real device browser QA: BLOCKED pending branch CI/deployment and authorized runtime-log access. Do not call the app ready until these are exercised.
