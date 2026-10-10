const CACHE_NAME="tripple-s-spa-shell-v2";
const APP_SHELL=["/","/treatments","/book","/admin","/offline","/icon.svg","/manifest.webmanifest","/pwa-install.js"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{const request=event.request;if(request.method!=="GET"||!request.url.startsWith(self.location.origin))return;const url=new URL(request.url);
 if(url.pathname.startsWith("/_next/")){event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();void caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})) );return}
 if(request.mode==="navigate"){event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();void caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response}).catch(()=>caches.match(request).then(cached=>cached||caches.match(url.pathname)||caches.match("/offline"))));return}
 const isPublicAsset=["/images/","/fonts/"].some(prefix=>url.pathname.startsWith(prefix))||/\.(?:css|woff2?|ttf|otf|png|jpe?g|webp|svg|ico|avif)$/i.test(url.pathname);
 if(isPublicAsset){event.respondWith(caches.match(request).then(cached=>{const network=fetch(request).then(response=>{if(response.ok){const copy=response.clone();void caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response});return cached||network}));return}
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});