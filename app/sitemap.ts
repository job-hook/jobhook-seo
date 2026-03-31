import type { MetadataRoute } from "next";
import { getDb } from "../lib/firebaseAdmin";
import { CITIES } from "./data/cities";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://seo.job-hook.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
    },
  ];

const cleanCities = (CITIES || [])
  .filter((city: any) => typeof city === "string")
  .map((city: string) => city.trim().toLowerCase())
  .filter(
    (city: string) =>
      city &&
      city !== "undefined" &&
      city !== "unknown" &&
      city !== "null"
  );

const cityRoutes: MetadataRoute.Sitemap = cleanCities.map((city: string) => ({
  url: `${baseUrl}/jobs/${city.replace(/\s+/g, "-")}`,
  lastModified: new Date(),
}));
  const db = getDb();

  const snap = await db.collection("Jobs").limit(5000).get();

  const jobRoutes: MetadataRoute.Sitemap = snap.docs
    .map((doc) => {
      const data: any = doc.data();

      const rawCity =
        data.jobCity ||
        data.city ||
        data.location ||
        data.jobLocation ||
        "";

const citySlug = rawCity
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\s+/g, "-");

if (
  !citySlug ||
  citySlug === "undefined" ||
  citySlug === "unknown" ||
  citySlug === "null"
) {
  return null;
}

      return {
        url: `${baseUrl}/jobs/${citySlug}/${doc.id}`,
        lastModified:
          data.updatedAt?.toDate?.() ||
          data.createdAt?.toDate?.() ||
          data.datePosted?.toDate?.() ||
          new Date(),
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticRoutes, ...cityRoutes, ...jobRoutes];
}