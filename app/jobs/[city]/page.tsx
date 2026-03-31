import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "../../../lib/firebaseAdmin";

const baseUrl = "https://seo.job-hook.com";

function prettifyCity(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugifyCity(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

type PageProps = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city } = await params;
  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettifyCity(citySlug) : "Unknown City";

  const title = `Jobs in ${cityName}, Namibia | JobHook`;
  const description = `Find the latest jobs in ${cityName}, Namibia. Browse new job opportunities, hiring now positions, and entry-level jobs across multiple industries on JobHook.`;

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

export default async function CityJobs({ params }: PageProps) {
  const { city } = await params;

  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettifyCity(citySlug) : "Unknown City";

  const db = getDb();
  const snap = await db.collection("Jobs").limit(500).get();

  const jobs = snap.docs
    .map((doc) => {
      const data: any = doc.data();

      const rawCity =
        data?.jobCity ||
        data?.city ||
        data?.location ||
        data?.jobLocation ||
        "";

      const rawTitle = data?.title || "Job Opportunity";
      const rawCompany = data?.companyName || data?.company || "Company";
      const rawDescription = data?.description || "No description provided.";
      const rawJobType = data?.jobType || "Not specified";
      const rawSalary = data?.salary || "Not specified";

      const docCitySlug = slugifyCity(rawCity);

      return {
        id: doc.id,
        citySlug: docCitySlug,
        cityName: rawCity || cityName,
        title: rawTitle,
        company: rawCompany,
        description: rawDescription,
        jobType: rawJobType,
        salary: rawSalary,
        status: data?.status,
        approved: data?.approved,
      };
    })
    .filter((job) => job.citySlug === citySlug)
    .filter((job) => {
      if (job.status && job.status !== "approved") return false;
      if (job.approved === false) return false;
      return true;
    });

  return (
    <main style={{ padding: 30, fontFamily: "system-ui", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Jobs in {cityName}</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
        Find the latest jobs in {cityName}, Namibia. Browse new job opportunities,
        hiring now positions, and entry-level jobs across multiple industries.
        JobHook helps job seekers discover opportunities faster.
      </p>

      {jobs.length === 0 ? (
        <p style={{ marginTop: 25 }}>No jobs found for {cityName} yet.</p>
      ) : (
        <div style={{ marginTop: 30, display: "grid", gap: 20 }}>
          {jobs.map((job) => (
            <article
              key={job.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>
                <Link href={`/jobs/${citySlug}/${job.id}`}>{job.title}</Link>
              </h2>

              <p style={{ marginBottom: 8 }}>
                <strong>{job.company}</strong> — {cityName}
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Job Type:</strong> {job.jobType}
              </p>

              <p style={{ marginBottom: 12 }}>
                <strong>Salary:</strong> {job.salary}
              </p>

              <p style={{ lineHeight: 1.6 }}>
                {job.description.length > 220
                  ? `${job.description.slice(0, 220)}...`
                  : job.description}
              </p>

              <p style={{ marginTop: 16 }}>
                <Link href={`/jobs/${citySlug}/${job.id}`}>View full job</Link>
              </p>
            </article>
          ))}
        </div>
      )}

      <p style={{ marginTop: 30 }}>
        <Link href="/jobs">← Back to all jobs</Link>
      </p>
    </main>
  );
}