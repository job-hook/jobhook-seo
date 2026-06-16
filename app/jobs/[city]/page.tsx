import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "../../../lib/firebaseAdmin";
import {
  formatPostedAge,
  getCompany,
  getDescription,
  getJobCity,
  getJobCitySlug,
  getJobTitle,
  getJobType,
  getPostedMs,
  getSalary,
  isActiveJob,
  type JobRecord,
  jobDetailPath,
  normalizeCitySlug,
  prettifyCity,
} from "@/lib/seoJobs";

type PageProps = {
  params: Promise<{ city: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: rawCity } = await params;
  const citySlug = normalizeCitySlug(rawCity);
  const city = citySlug ? prettifyCity(citySlug) : "Namibia";

  return {
    title:
      city === "Namibia"
        ? "Jobs in Namibia | JobHook"
        : `Jobs in ${city}, Namibia | JobHook`,
    description:
      city === "Namibia"
        ? "Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay, Swakopmund, Oshakati and more."
        : `Browse active jobs in ${city}, Namibia. Updated daily on JobHook.`,
  };
}

export default async function CityJobs({ params }: PageProps) {
  const { city } = await params;
  const citySlug = normalizeCitySlug(city);
  const cityName = citySlug ? prettifyCity(citySlug) : "Unknown City";

  const db = getDb();
  const snapshot = await db
    .collection("Jobs")
    .orderBy("postedAt", "desc")
    .limit(5000)
    .get();

  const jobs = snapshot.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
      };
    })
    .filter((job: JobRecord) => isActiveJob(job))
    .filter((job: JobRecord) => getJobCitySlug(job) === citySlug)
    .sort((a: JobRecord, b: JobRecord) => getPostedMs(b) - getPostedMs(a));

  return (
    <main
      style={{
        padding: 30,
        fontFamily: "system-ui",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Jobs in {cityName}</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
        Find active jobs in {cityName}, Namibia. Browse new job opportunities,
        hiring now positions, and entry-level jobs across multiple industries.
        JobHook helps job seekers discover opportunities faster.
      </p>

      {jobs.length === 0 ? (
        <p style={{ marginTop: 25 }}>No jobs found for {cityName} yet.</p>
      ) : (
        <div style={{ marginTop: 30, display: "grid", gap: 20 }}>
          {jobs.map((job: JobRecord) => (
            <article
              key={job.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h2 style={{ fontSize: 24, marginBottom: 8 }}>
                <Link href={jobDetailPath(job)}>{getJobTitle(job)}</Link>
              </h2>

              <p style={{ marginBottom: 8 }}>
                <strong>{getCompany(job)}</strong> - {getJobCity(job) || cityName}
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Job Type:</strong> {getJobType(job)}
              </p>

              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginTop: "6px",
                }}
              >
                Posted {formatPostedAge(job.postedAt || job.createdAt || job.datePosted)}
              </p>

              <p style={{ marginBottom: 12 }}>
                <strong>Salary:</strong> {getSalary(job)}
              </p>

              <p style={{ lineHeight: 1.6 }}>
                {getDescription(job).length > 220
                  ? `${getDescription(job).slice(0, 220)}...`
                  : getDescription(job)}
              </p>

              <p style={{ marginTop: 16 }}>
                <Link
                  href={jobDetailPath(job)}
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    padding: "8px 14px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  View full job
                </Link>
              </p>
            </article>
          ))}
        </div>
      )}

      <p style={{ marginTop: 30 }}>
        <Link href="/jobs">Back to all cities</Link>
      </p>
    </main>
  );
}
