"use client";

import { useEffect, useState } from "react";

export default function PwaRegister() {
  const [offline, setOffline] = useState(false);
  const [installable, setInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const online = () => setOffline(false);
    const offlineNow = () => setOffline(true);
    const installPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstallable(true);
    };
    const installed = () => {
      setDeferredPrompt(null);
      setInstallable(false);
    };

    window.addEventListener("online", online);
    window.addEventListener("offline", offlineNow);
    window.addEventListener("beforeinstallprompt", installPrompt);
    window.addEventListener("appinstalled", installed);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offlineNow);
      window.removeEventListener("beforeinstallprompt", installPrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallable(false);
  }

  return (
    <>
      {offline && (
        <div className="offlineBanner" role="status">
          Offline mode · previously loaded Tripple S pages remain available. A booking request is only received by the clinic after it synchronizes.
        </div>
      )}
      {installable && (
        <div className="pwaInstall" role="region" aria-label="Install Tripple S Spa">
          <div>
            <strong>Install Tripple S Spa</strong>
            <span>Keep the spa one tap away.</span>
          </div>
          <button type="button" onClick={() => void install()}>
            Install
          </button>
        </div>
      )}
    </>
  );
}

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }
}
