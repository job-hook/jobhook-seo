import { getDb } from "@/lib/firebaseAdmin";
import {
  formatPostedAge,
  getDescription,
  getJobCity,
  getJobTitle,
  getJobType,
  getPostedMs,
  isActiveJob,
  type JobRecord,
  jobDetailPath,
} from "@/lib/seoJobs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay, Swakopmund, Oshakati and more. Apply easily on JobHook.",
};

async function getJobs() {
  const db = getDb();

  const snapshot = await db
    .collection("Jobs")
    .orderBy("postedAt", "desc")
    .limit(500)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((job: JobRecord) => isActiveJob(job))
    .sort((a: JobRecord, b: JobRecord) => getPostedMs(b) - getPostedMs(a))
    .slice(0, 6);
}

const popularCities = [
  "Windhoek",
  "Walvis Bay",
  "Swakopmund",
  "Oshakati",
  "Ongwediva",
  "Rundu",
  "Katima Mulilo",
  "Otjiwarongo",
  "Okahandja",
  "Keetmanshoop",
  "Gobabis",
  "Mariental",
];

export default async function HomePage() {
  const jobs = await getJobs();

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <section style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
          Find Jobs in Namibia
        </h1>

        <p style={{ color: "#555", marginTop: "10px" }}>
          Discover real job opportunities in Windhoek, Walvis Bay, Swakopmund
          and more.
        </p>

        <Link
          href="/all-jobs"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 20px",
            background: "black",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Browse Jobs
        </Link>

        <form
          action="/all-jobs"
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "22px",
            maxWidth: "560px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="search"
            name="q"
            placeholder="Search by job title, company, keyword, or city"
            aria-label="Search jobs"
            style={{
              flex: "1 1 280px",
              padding: "12px 14px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 18px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search Jobs
          </button>
        </form>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Browse Jobs by City</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {popularCities.map((city) => (
            <Link
              key={city}
              href={`/jobs/${city.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "black",
                background: "#f9f9f9",
              }}
            >
              {city}
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/all-jobs"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#f3f4f6",
              color: "#111827",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View All Jobs
          </Link>

          <Link
            href="/jobs"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#2563eb",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View Other Cities
          </Link>
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Latest Jobs</h2>
        <p>{jobs.length} jobs found</p>

        <div style={{ display: "grid", gap: "20px" }}>
          {jobs.length === 0 ? (
            <p>No jobs found yet.</p>
          ) : (
            jobs.map((job: JobRecord) => (
              <article
                key={job.id}
                style={{
                  padding: "15px",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                }}
              >
                <h3>{getJobTitle(job)}</h3>

                <p style={{ color: "#666" }}>
                  {getJobCity(job) || "Namibia"} -{" "}
                  {getJobType(job)}
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

                <p style={{ marginTop: "8px" }}>
                  {getDescription(job).slice(0, 100)}...
                </p>

                <Link href={jobDetailPath(job)}>
                  <button
                    style={{
                      marginTop: "10px",
                      padding: "8px 14px",
                      background: "#2a66e6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    View Job
                  </button>
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
