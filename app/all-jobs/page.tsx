import Link from "next/link";
import { getDb } from "@/lib/firebaseAdmin";
import {
  formatPostedAge,
  getCompany,
  getDescription,
  getJobCity,
  getJobTitle,
  getJobType,
  getPostedMs,
  getSalary,
  isActiveJob,
  type JobRecord,
  jobDetailPath,
  matchesJobSearch,
} from "@/lib/seoJobs";

type PageProps = {
  searchParams?: Promise<{ q?: string }>;
};

async function getAllJobs(query: string) {
  const db = getDb();

  const snapshot = await db
    .collection("Jobs")
    .orderBy("postedAt", "desc")
    .limit(5000)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((job: JobRecord) => isActiveJob(job))
    .filter((job: JobRecord) => matchesJobSearch(job, query))
    .sort((a: JobRecord, b: JobRecord) => getPostedMs(b) - getPostedMs(a))
    .slice(0, 50);
}

export default async function AllJobsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const query = typeof params?.q === "string" ? params.q.trim() : "";
  const jobs = await getAllJobs(query);

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "18px",
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        &larr; Back to Home
      </Link>

      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
        All Jobs in Namibia
      </h1>

      <p style={{ color: "#555", marginBottom: "24px", lineHeight: 1.6 }}>
        Browse active jobs across Namibia, sorted from newest to oldest.
      </p>

      <form
        action="/all-jobs"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="search"
          name="q"
          defaultValue={query}
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
          Search
        </button>
        {query ? (
          <Link
            href="/all-jobs"
            style={{
              padding: "12px 14px",
              color: "#374151",
              textDecoration: "none",
            }}
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.length === 0 ? (
          <p>{query ? `No jobs found for "${query}".` : "No jobs found yet."}</p>
        ) : (
          jobs.map((job: JobRecord) => (
            <article
              key={job.id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                {getJobTitle(job)}
              </h2>

              <p style={{ marginBottom: "8px" }}>
                <strong>{getCompany(job)}</strong> -{" "}
                {getJobCity(job) || "Namibia"}
              </p>

              <p style={{ marginBottom: "8px" }}>
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

              <p style={{ marginBottom: "12px" }}>
                <strong>Salary:</strong> {getSalary(job)}
              </p>

              <p style={{ lineHeight: 1.6 }}>
                {getDescription(job).length > 220
                  ? `${getDescription(job).slice(0, 220)}...`
                  : getDescription(job)}
              </p>

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
            </article>
          ))
        )}
      </div>
    </main>
  );
}
