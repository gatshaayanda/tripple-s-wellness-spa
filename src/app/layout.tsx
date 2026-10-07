import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";

const siteUrl = "https://trippleswellnessspa.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tripple S Wellness Spa | Medical Aesthetics & Wellness",
    template: "%s | Tripple S Wellness Spa",
  },
  description: "Tripple S Wellness Spa — medical aesthetics, skin health, IV wellness and body contouring in Gaborone.",
  applicationName: "Tripple S Wellness Spa",
  generator: "Next.js",
  keywords: ["Tripple S Wellness Spa", "medical aesthetics", "skin health", "IV wellness", "body contouring", "Gaborone"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Tripple S Wellness Spa",
    title: "Tripple S Wellness Spa | Medical Aesthetics & Wellness",
    description: "Where beauty meets medical excellence.",
  },
  twitter: {
    card: "summary",
    title: "Tripple S Wellness Spa | Medical Aesthetics & Wellness",
    description: "Where beauty meets medical excellence.",
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Tripple S Spa",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#171614",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
