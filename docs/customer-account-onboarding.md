# Customer account and notification setup

## Customer journey

- Appointment requests remain guest-first. The booking form silently uses Firebase Anonymous Auth when the public web configuration is available; auth failure does not block a guest request.
- After submission, customers continue to **My Tripple S** to view request status, optionally connect Google, choose notification preferences, and view currently published offers.
- Google linking preserves the anonymous UID and request history. If a Google credential already belongs to another UID, the app asks the customer to choose the existing account explicitly; histories are never merged silently.
- Requests are not confirmations. Only staff-updated statuses can mark an appointment confirmed.
- Offers shown in the account come from currently active clinic-published loyalty programmes. No points, balances, or benefits are invented.

## Push prerequisites

Push notifications are optional. Before enabling them in a deployment:
1. Configure `NEXT_PUBLIC_FIREBASE_VAPID_KEY` with the public Web Push certificate key from Firebase Console → Project settings → Cloud Messaging.
2. Verify the Firebase web app uses the intended `tripple-s-wellness-spa` project and that the deployed `FIREBASE_ADMIN_KEY` is valid JSON for that same project.
3. Test on a supported HTTPS browser/device. Permission granted, token registered, server send accepted, and notification visibly received are separate acceptance checks.
4. Do not treat a successful server response as proof that the operating system displayed the notification.

Notification preferences and device tokens are accessed through authenticated server routes and scoped to the verified Firebase UID. The service worker must not cache private account pages or API responses.

## Acceptance checklist

- [ ] Earliest available time begins at the configured opening time, respecting the selected treatment duration, interval, minimum notice, active booking requests, and active calendar blocks.
- [ ] Orphaned reservations left by deleted or cancelled records do not suppress otherwise-open hours; active overlaps remain blocked at read and submit time.
- [ ] A guest request still succeeds if optional Firebase Auth cannot initialize.
- [ ] A request made with a verified Firebase identity appears only in that identity's private account history.
- [ ] Google linking preserves the current UID; an existing-account collision is handled explicitly.
- [ ] Only valid active offers are shown.
- [ ] Missing VAPID configuration is explained without requesting browser permission.
- [ ] Notification preferences save through authenticated server routes; test-send and real device receipt are verified separately.
- [ ] Private account/API pages and responses are not cached by the service worker.
