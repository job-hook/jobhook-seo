import type { MetadataRoute } from "next";
import { getDb } from "../lib/firebaseAdmin";
import { CITIES } from "./data/cities";
import {
  getJobCitySlug,
  getPostedMs,
  isActiveJob,
  type JobRecord,
  jobDetailPath,
  normalizeCitySlug,
  toSafeDate,
} from "@/lib/seoJobs";

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
    {
      url: `${baseUrl}/all-jobs`,
      lastModified: new Date(),
    },
  ];

  const validCities = new Set(
    (CITIES || [])
      .map((city) => normalizeCitySlug(city))
      .filter(
        (city) =>
          city &&
          city !== "undefined" &&
          city !== "unknown" &&
          city !== "null"
      )
  );

  const db = getDb();
  const snap = await db.collection("Jobs").limit(5000).get();

  const activeJobs = snap.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((job: JobRecord) => isActiveJob(job));

  const activeCitySlugs = Array.from(
    new Set(
      activeJobs
        .map((job: JobRecord) => getJobCitySlug(job))
        .filter((citySlug: string) => validCities.has(citySlug))
    )
  ).sort();

  const cityRoutes: MetadataRoute.Sitemap = activeCitySlugs.map((city) => ({
    url: `${baseUrl}/jobs/${city}`,
    lastModified: new Date(),
  }));

  const jobRoutes: MetadataRoute.Sitemap = activeJobs
    .filter((job: JobRecord) => validCities.has(getJobCitySlug(job)))
    .sort((a: JobRecord, b: JobRecord) => getPostedMs(b) - getPostedMs(a))
    .map((job: JobRecord) => ({
      url: `${baseUrl}${jobDetailPath(job)}`,
      lastModified:
        toSafeDate(job.updatedAt) ||
        toSafeDate(job.postedAt) ||
        toSafeDate(job.createdAt) ||
        new Date(),
    }));

  return [...staticRoutes, ...cityRoutes, ...jobRoutes];
}
