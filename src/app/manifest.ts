import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tripple S Wellness Spa",
    short_name: "Tripple S Spa",
    description: "Medical aesthetics, skin health and wellness in Gaborone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f1",
    theme_color: "#171614",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["health", "beauty", "lifestyle"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}