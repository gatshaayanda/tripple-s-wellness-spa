"use client";

import { useCallback, useEffect, useState } from "react";

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

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
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
  return /^\/(admin|account)(\/|$)/i.test(window.location.pathname);
}

export default function PwaRegister() {
  const [offline, setOffline] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState<string | null>(null);
  const [handoffFallback, setHandoffFallback] = useState(false);
  const [installPromptAvailable, setInstallPromptAvailable] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");

  useEffect(() => {
    setOffline(!navigator.onLine);
    const ua = navigator.userAgent || "";
    setPlatform(/iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "desktop");
    const marker = new URL(window.location.href).searchParams.get("__external_browser");
    if (marker === "1" && !getInAppBrowser()) {
      const clean = new URL(window.location.href);
      clean.searchParams.delete("__external_browser");
      window.history.replaceState(window.history.state, "", clean.pathname + clean.search + clean.hash);
    }
    const standalone = isStandalone() || window.__trippleSPwa?.installed === true;
    setInstalled(standalone);
    const embeddedBrowser = getInAppBrowser();\n    if (!standalone && !(marker === "1" && !embeddedBrowser) && !isPrivateRoute()) setInAppBrowser(embeddedBrowser);

    const online = () => setOffline(false);
    const offlineNow = () => setOffline(true);
    const installable = () => {
      if (!isStandalone() && !window.__trippleSPwa?.installed) setInstallPromptAvailable(Boolean(window.__trippleSPwa?.deferredPrompt));
    };
    const appInstalled = () => {
      setInstalled(true);
      setInstallPromptAvailable(false);
      setShowInstallHelp(false);
      setInAppBrowser(null);
      setHandoffFallback(false);
    };
    window.addEventListener("online", online);
    window.addEventListener("offline", offlineNow);
    window.addEventListener("tripple:pwa-installable", installable);
    window.addEventListener("tripple:pwa-installed", appInstalled);
    installable();

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
        console.error("Tripple S service worker registration failed", error);
      });
    }
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offlineNow);
      window.removeEventListener("tripple:pwa-installable", installable);
      window.removeEventListener("tripple:pwa-installed", appInstalled);
    };
  }, []);

  const openNormalBrowser = useCallback(() => {
    const destination = new URL(window.location.href);
    destination.searchParams.set("__external_browser", "1");
    const httpsUrl = destination.toString();
    const ua = navigator.userAgent || "";
    setHandoffFallback(false);
    if (/Android/i.test(ua)) {
      const intentUrl = `intent://${destination.host}${destination.pathname}${destination.search}${destination.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(httpsUrl)};end`;
      window.location.href = intentUrl;
      window.setTimeout(() => setHandoffFallback(true), 1400);
      return;
    }
    if (/iPhone|iPad|iPod/i.test(ua)) {
      window.location.href = `x-safari-https://${destination.host}${destination.pathname}${destination.search}${destination.hash}`;
      window.setTimeout(() => setHandoffFallback(true), 1400);
      return;
    }
    window.open(httpsUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setHandoffFallback(true), 700);
  }, []);

  const install = useCallback(async () => {
    const deferred = window.__trippleSPwa?.deferredPrompt;
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") {
          setInstalled(true);
          setShowInstallHelp(false);
        }
        window.__trippleSPwa!.deferredPrompt = null;
        setInstallPromptAvailable(false);
      } catch (error) {
        console.error("Tripple S native install prompt failed", error);
        setShowInstallHelp(true);
      }
      return;
    }
    setShowInstallHelp(true);
  }, []);

  const copyCurrentUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setHandoffFallback(true);
    } catch {
      setHandoffFallback(true);
    }
  }, []);

  const showGate = Boolean(inAppBrowser) && !installed && !isPrivateRoute();
  const showInstall = !showGate && !installed && !isStandalone() && !isPrivateRoute();

  return (
    <>
      {offline && <div className="offlineBanner" role="status">Offline mode · previously loaded Tripple S pages may remain available. A booking request is received only after the clinic receives it online.</div>}

      {showGate && (
        <div className="browserGate" role="dialog" aria-modal="true" aria-labelledby="browserGateTitle">
          <div className="browserGateCard">
            <span className="browserGateKicker">TRIPPLE S WELLNESS SPA</span>
            <h1 id="browserGateTitle">A better experience in your browser.</h1>
            <p>You're viewing Tripple S inside {inAppBrowser}. Open this same page in your normal browser to make booking and app installation work more reliably.</p>
            <button className="browserGatePrimary" type="button" onClick={openNormalBrowser}>{platform === "android" ? "Open in Chrome" : platform === "ios" ? "Open in Safari" : "Open in browser"} <span aria-hidden="true">↗</span></button>
            <button className="browserGateSecondary" type="button" onClick={() => void copyCurrentUrl()}>Copy this page link</button>
            {handoffFallback && <div className="browserGateHelp" role="status"><strong>If your browser did not open:</strong><span>Use the menu in {inAppBrowser} and choose Open in browser, Chrome, or Safari. The copied link keeps this page.</span></div>}
            <p className="browserGateFoot">Your current page is preserved. This step is only for leaving the in-app browser.</p>
          </div>
        </div>
      )}

      {showInstall && (
        <div className="pwaInstall" role="region" aria-label="Install Tripple S Wellness Spa">
          <div><strong>Install Tripple S Spa</strong><span>Keep treatments and appointment details one tap away.</span></div>
          <button type="button" onClick={() => void install()}>Install</button>
        </div>
      )}

      {showInstallHelp && showInstall && (
        <div className="installHelpBackdrop" role="presentation">
          <section className="installHelpPanel" role="dialog" aria-modal="true" aria-labelledby="installHelpTitle">
            <button className="installHelpClose" type="button" aria-label="Close installation help" onClick={() => setShowInstallHelp(false)}>×</button>
            <span className="browserGateKicker">TRIPPLE S WELLNESS SPA</span>
            <h2 id="installHelpTitle">Install Tripple S Spa</h2>
            {platform === "android" ? <p>In Chrome, open the browser menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>, if offered.</p> : platform === "ios" ? <p>In Safari, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>. If you opened this link in another app, first choose Open in Safari.</p> : <p>In Chrome or Edge, use the install icon in the address bar or the browser menu and choose <strong>Install Tripple S Wellness Spa</strong>, if offered.</p>}
            <p className="installHelpNote">The browser controls whether installation is available. If the option is missing, keep using Tripple S in this browser; no installation has been claimed.</p>
            <button className="browserGatePrimary" type="button" onClick={() => setShowInstallHelp(false)}>Continue browsing</button>
          </section>
        </div>
      )}
    </>
  );
}
