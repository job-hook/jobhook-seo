import Link from "next/link";
import { getDb } from "@/lib/firebaseAdmin";

function getTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return "Just posted";
  if (hours < 24) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

async function getAllJobs() {
  const db = getDb();

  const snapshot = await db
  .collection("Jobs")
  .where("expireAt", ">", new Date())
  .orderBy("expireAt")
  .orderBy("postedAt", "desc")
  .limit(50)
  .get();

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export default async function AllJobsPage() {
  const jobs = await getAllJobs();

  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>All Jobs in Namibia</h1>

      <p style={{ color: "#555", marginBottom: "30px", lineHeight: 1.6 }}>
        Browse all available jobs across Namibia, sorted from newest to oldest.
      </p>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.length === 0 ? (
          <p>No jobs found yet.</p>
        ) : (
          jobs.map((job: any) => (
            <div
              key={job.id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                {job.title}
              </h2>

              <p style={{ marginBottom: "8px" }}>
                <strong>{job.company}</strong> — {job.jobCity}
              </p>

              <p style={{ marginBottom: "8px" }}>
                <strong>Job Type:</strong> {job.jobType}
              </p>

              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                {job.postedAt ? getTimeAgo(job.postedAt.toDate()) : "Recently posted"}
              </p>

              <p style={{ marginBottom: "12px" }}>
                <strong>Salary:</strong> {job.salary}
              </p>

              <p style={{ lineHeight: 1.6 }}>
                {job.description?.length > 220
                  ? `${job.description.slice(0, 220)}...`
                  : job.description}
              </p>

              <Link
                href={`/jobs/${job.jobCity?.toLowerCase()}/${job.id}`}
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
            </div>
          ))
        )}
      </div>
    </main>
  );
}