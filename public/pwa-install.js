(() => {
  if (typeof window === "undefined") return;
  window.__trippleSPwa = window.__trippleSPwa || { deferredPrompt: null, installed: false };
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.__trippleSPwa.deferredPrompt = event;
    window.dispatchEvent(new Event("tripple:pwa-installable"));
  });
  window.addEventListener("appinstalled", () => {
    window.__trippleSPwa.deferredPrompt = null;
    window.__trippleSPwa.installed = true;
    window.dispatchEvent(new Event("tripple:pwa-installed"));
  });
})();