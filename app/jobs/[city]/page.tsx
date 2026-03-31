import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = "https://seo.job-hook.com";

function prettifyCity(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {

  const { city } = await params;
  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettifyCity(citySlug) : "Unknown City";

  const title = `Jobs in ${cityName}, Namibia | JobHook`;
  const description = `Find the latest jobs in ${cityName}, Namibia. Browse new job opportunities, hiring now positions, and entry-level jobs across multiple industries. JobHook helps job seekers discover opportunities faster.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/jobs/${citySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/jobs/${citySlug}`,
      siteName: "JobHook",
      type: "website",
    },
  };
}

export default async function CityJobs({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettifyCity(citySlug) : "Unknown City";

  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Jobs in {cityName}</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
        Find the latest jobs in {cityName}, Namibia. Browse new job opportunities,
        hiring now positions, and entry-level jobs across multiple industries.
        JobHook helps job seekers discover opportunities faster.
      </p>

      <p style={{ marginTop: 25 }}>No jobs found for {cityName} yet.</p>

      <Link href="/jobs" style={{ display: "inline-block", marginTop: 30 }}>
        ← Back to all jobs
      </Link>
    </main>
  );
}
