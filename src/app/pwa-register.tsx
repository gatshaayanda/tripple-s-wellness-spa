"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };
interface DeferredInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}
interface PwaBridge {
  deferredPrompt: DeferredInstallPrompt | null;
  installed: boolean;
}
declare global {
  interface Window {
    __trippleSPwa?: PwaBridge;
  }
}

type Platform = "android" | "ios" | "desktop";

function isStandalone() {
  return typeof window !== "undefined" && (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function getInAppBrowser() {
  const ua = navigator.userAgent || "";
  if (/WhatsApp/i.test(ua)) return "WhatsApp";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/FBAN|FBAV|FBIOS|FB_IAB/i.test(ua)) return "Facebook";
  if (/TikTok/i.test(ua)) return "TikTok";
  if (/Telegram/i.test(ua)) return "Telegram";
  if (/Line\//i.test(ua)) return "LINE";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  return null;
}

function isPrivateRoute() {
  return typeof window !== "undefined" && /^\/(admin|account)(\/|$)/i.test(window.location.pathname);
}

export default function PwaRegister() {
  const [offline, setOffline] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState<string | null>(null);
  const [handoffFallback, setHandoffFallback] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [privateRoute, setPrivateRoute] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [updateReady, setUpdateReady] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const refreshAfterUpdate = useRef(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const ua = navigator.userAgent || "";
    const detectedPlatform: Platform = /Android/i.test(ua) ? "android" : /iPhone|iPad|iPod/i.test(ua) ? "ios" : "desktop";
    setPlatform(detectedPlatform);

    const currentUrl = new URL(window.location.href);
    const externalMarker = currentUrl.searchParams.get("__external_browser");
    const embeddedBrowser = getInAppBrowser();
    if (externalMarker === "1" && !embeddedBrowser) {
      currentUrl.searchParams.delete("__external_browser");
      window.history.replaceState(window.history.state, "", currentUrl.pathname + currentUrl.search + currentUrl.hash);
    }

    const standalone = isStandalone() || window.__trippleSPwa?.installed === true;
    setInstalled(standalone);
    setPrivateRoute(isPrivateRoute());
    if (!standalone && !(externalMarker === "1" && !embeddedBrowser) && !isPrivateRoute()) {
      setInAppBrowser(embeddedBrowser);
    }

    const online = () => setOffline(false);
    const offlineNow = () => setOffline(true);
    const appInstalled = () => {
      setInstalled(true);
      setShowInstallHelp(false);
      setInAppBrowser(null);
      setHandoffFallback(false);
    };

    window.addEventListener("online", online);
    window.addEventListener("offline", offlineNow);
    window.addEventListener("tripple:pwa-installed", appInstalled);

    let updateListener: (() => void) | undefined;
    let visibilityListener: (() => void) | undefined;
    let controllerListener: (() => void) | undefined;
    if ("serviceWorker" in navigator) {
      let reloading = false;
      controllerListener = () => {
        if (!refreshAfterUpdate.current || reloading) return;
        reloading = true;
        window.location.reload();
      };
      navigator.serviceWorker.addEventListener("controllerchange", controllerListener);

      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((registration) => {
        registrationRef.current = registration;

        const checkWaitingWorker = () => {
          if (registration.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
        };
        checkWaitingWorker();
        updateListener = () => {
          const installing = registration.installing;
          if (!installing) {
            checkWaitingWorker();
            return;
          }
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateReady(Boolean(registration.waiting));
            }
          });
        };
        registration.addEventListener("updatefound", updateListener);

        visibilityListener = () => {
          if (document.visibilityState === "visible") {
            void registration.update().catch(() => undefined);
            checkWaitingWorker();
          }
        };
        document.addEventListener("visibilitychange", visibilityListener);
        void registration.update().catch(() => undefined);
      }).catch((error) => {
        console.error("Tripple S service worker registration failed", error);
      });
    }

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offlineNow);
      window.removeEventListener("tripple:pwa-installed", appInstalled);
      if ("serviceWorker" in navigator) {
        if (updateListener && registrationRef.current) registrationRef.current.removeEventListener("updatefound", updateListener);
        if (visibilityListener) document.removeEventListener("visibilitychange", visibilityListener);
        if (controllerListener) navigator.serviceWorker.removeEventListener("controllerchange", controllerListener);
      }
    };
  }, []);

  const openNormalBrowser = useCallback(() => {
    const destination = new URL(window.location.href);
    destination.searchParams.set("__external_browser", "1");
    const httpsUrl = destination.toString();
    const ua = navigator.userAgent || "";
    setHandoffFallback(false);
    setLinkCopied(false);

    if (/Android/i.test(ua)) {
      const intentUrl = "intent://" + destination.host + destination.pathname + destination.search + destination.hash +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" + encodeURIComponent(httpsUrl) + ";end";
      window.location.href = intentUrl;
      window.setTimeout(() => setHandoffFallback(true), 1400);
      return;
    }
    if (/iPhone|iPad|iPod/i.test(ua)) {
      window.location.href = "x-safari-https://" + destination.host + destination.pathname + destination.search + destination.hash;
      window.setTimeout(() => setHandoffFallback(true), 1400);
      return;
    }
    const opened = window.open(httpsUrl, "_blank", "noopener,noreferrer");
    if (!opened) setHandoffFallback(true);
  }, []);

  const copyCurrentUrl = useCallback(async () => {
    const destination = new URL(window.location.href);
    destination.searchParams.set("__external_browser", "1");
    try {
      await navigator.clipboard.writeText(destination.toString());
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
    setHandoffFallback(true);
  }, []);

  const install = useCallback(async () => {
    const deferred = window.__trippleSPwa?.deferredPrompt;
    if (!deferred) {
      setShowInstallHelp(true);
      return;
    }
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      window.__trippleSPwa!.deferredPrompt = null;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setShowInstallHelp(false);
      } else {
        setShowInstallHelp(true);
      }
    } catch (error) {
      console.error("Tripple S native install prompt failed", error);
      setShowInstallHelp(true);
    }
  }, []);

  const refreshApp = useCallback(() => {
    const waiting = registrationRef.current?.waiting;
    if (!waiting) {
      setUpdateReady(false);
      void registrationRef.current?.update().catch(() => undefined);
      return;
    }
    refreshAfterUpdate.current = true;
    waiting.postMessage({ type: "SKIP_WAITING" });
  }, []);

  const showGate = Boolean(inAppBrowser) && !installed && !privateRoute;
  const showInstall = !showGate && !installed && !privateRoute;

  return (
    <>
      {offline && (
        <div className="offlineBanner" role="status">
          You’re offline. Previously opened public pages may remain available. Appointment requests are received only when the clinic receives them online.
        </div>
      )}

      {showGate && (
        <div className="browserGate" role="dialog" aria-modal="true" aria-labelledby="browserGateTitle">
          <div className="browserGateCard">
            <span className="browserGateKicker">TRIPPLE S WELLNESS SPA</span>
            <h1 id="browserGateTitle">Open Tripple S in your browser.</h1>
            <p>You’re viewing Tripple S inside {inAppBrowser}. Open this same page in your normal browser for the most reliable booking and installation experience.</p>
            <button className="browserGatePrimary" type="button" onClick={openNormalBrowser}>
              {platform === "android" ? "Open in Chrome" : platform === "ios" ? "Open in Safari" : "Open in browser"} <span aria-hidden="true">↗</span>
            </button>
            <button className="browserGateSecondary" type="button" onClick={() => void copyCurrentUrl()}>Copy this page link</button>
            {handoffFallback && (
              <div className="browserGateHelp" role="status">
                <strong>If your browser did not open:</strong>
                <span>{linkCopied ? "The page link was copied. Paste it into Chrome or Safari." : "Use the " + inAppBrowser + " menu and choose Open in browser, Chrome, or Safari."}</span>
              </div>
            )}
            <p className="browserGateFoot">Your current page is preserved. Installation is optional; you can continue using Tripple S as a website.</p>
          </div>
        </div>
      )}

      {showInstall && (
        <div className="pwaInstall" role="region" aria-label="Install Tripple S Wellness Spa">
          <div><strong>Install Tripple S Spa</strong><span>Keep the spa one tap away.</span></div>
          <button type="button" onClick={() => void install()}>Install</button>
        </div>
      )}

      {showInstallHelp && showInstall && (
        <div className="installHelpBackdrop" role="presentation">
          <section className="installHelpPanel" role="dialog" aria-modal="true" aria-labelledby="installHelpTitle">
            <button className="installHelpClose" type="button" aria-label="Close installation help" onClick={() => setShowInstallHelp(false)}>×</button>
            <span className="browserGateKicker">TRIPPLE S WELLNESS SPA</span>
            <h2 id="installHelpTitle">Install Tripple S Spa</h2>
            {platform === "android" ? (
              <p>In Chrome, open the browser menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>, if offered.</p>
            ) : platform === "ios" ? (
              <p>In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>. If you opened this link in another app, first choose Open in Safari.</p>
            ) : (
              <p>In Chrome or Edge, use the install icon in the address bar or browser menu and choose <strong>Install Tripple S Wellness Spa</strong>, if offered.</p>
            )}
            <p className="installHelpNote">The browser controls whether installation is available. If the option is missing, keep using Tripple S in this browser; no installation is being claimed.</p>
            <button className="browserGatePrimary" type="button" onClick={() => setShowInstallHelp(false)}>Continue browsing</button>
          </section>
        </div>
      )}

      {updateReady && (
        <div className="pwaUpdate" role="region" aria-label="App update available">
          <div><strong>Tripple S has an update</strong><span>Refresh when you’re ready to load the latest version.</span></div>
          <button type="button" onClick={refreshApp}>Refresh</button>
        </div>
      )}
    </>
  );
}
