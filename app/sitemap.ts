import type { MetadataRoute } from "next";
import { CITIES } from "./data/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "http://localhost:3000";

  const cityPages = CITIES.map((city) => ({
    url: `${baseUrl}/jobs/${city}`,
    lastModified: new Date(),
  }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/jobs`, lastModified: new Date() },
    ...cityPages,
  ];
}
