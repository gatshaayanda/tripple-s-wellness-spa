const CACHE_NAME = "tripple-s-spa-shell-v6";
const CACHE_PREFIX = "tripple-s-spa-shell-";
const APP_SHELL = ["/", "/treatments", "/book", "/offline", "/icon.svg", "/manifest.webmanifest"];

try {
  importScripts("https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js", "https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js");
  firebase.initializeApp({
    apiKey: "AIzaSyDOgUYyu2ZEMbZjb3mVtnjYD_lzEl79wzg",
    authDomain: "tripple-s-wellness-spa.firebaseapp.com",
    projectId: "tripple-s-wellness-spa",
    storageBucket: "tripple-s-wellness-spa.firebasestorage.app",
    messagingSenderId: "742237320978",
    appId: "1:742237320978:web:0d8d422c03de028f6965cb",
    measurementId: "G-L5VDQ5Q4YJ"
  });
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const title = payload.notification?.title || "Tripple S update";
    const body = payload.notification?.body || "Open My Tripple S to review your appointment.";
    const link = payload.fcmOptions?.link || payload.data?.link || "/account";
    self.registration.showNotification(title, { body, icon: "/icon.svg", badge: "/icon.svg", data: { link } });
  });
} catch (error) {
  console.warn("[Tripple S] background push unavailable", error);
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => {
        // First install can take control immediately; updates wait for the user.
        if (!self.registration.active) return self.skipWaiting();
        return undefined;
      })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const link = event.notification.data?.link || "/account";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(windows => {
      const target = new URL(link, self.location.origin);
      if (target.origin !== self.location.origin) return self.clients.openWindow("/account");
      for (const client of windows) {
        if (client.url === target.href && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(target.href);
    })
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Private pages and APIs are always network-only. Never cache admin/account HTML or API responses.
  if (/^\/(admin|account|api)(\/|$)/i.test(url.pathname)) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // Only immutable, fingerprinted Next.js assets are cache-first. Dynamic Next data remains network-only.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
    return;
  }
  if (url.pathname.startsWith("/_next/")) return;

  const isPublicPage = url.pathname === "/" ||
    url.pathname === "/treatments" ||
    url.pathname.startsWith("/treatments/") ||
    url.pathname === "/book" ||
    url.pathname === "/offline";
  if (request.mode === "navigate") {
    if (!isPublicPage) return;
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          void caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match(url.pathname) || caches.match("/offline")))
    );
    return;
  }

  const isPublicAsset = ["/images/", "/fonts/"].some(prefix => url.pathname.startsWith(prefix)) ||
    /^\/(?:icon\.svg|manifest\.webmanifest)$/i.test(url.pathname) ||
    /\.(?:css|woff2?|ttf|otf|png|jpe?g|webp|svg|ico|avif)$/i.test(url.pathname);
  if (isPublicAsset) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        });
        return cached || network;
      })
    );
  }
});
