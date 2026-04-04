import Link from "next/link";
import { getDb } from "@/lib/firebaseAdmin";

function toSafeDate(value: any): Date | null {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

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

function getPostedMs(value: any) {
  const d = toSafeDate(value);
  return d ? d.getTime() : 0;
}

async function getAllJobs() {
  const db = getDb();

  const snapshot = await db
 .collection("Jobs")
  .orderBy("postedAt", "desc")
  .limit(50)
  .get();


const jobs = snapshot.docs
  .map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((job: any) => {
    const expireDate = toSafeDate(job.expireAt);
    if (!expireDate) return true;
    return expireDate > new Date();
  })
  .sort((a: any, b: any) => getPostedMs(b.postedAt) - getPostedMs(a.postedAt));

return jobs;
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
  {toSafeDate(job.postedAt) ? getTimeAgo(toSafeDate(job.postedAt) as Date) : "Recently posted"}
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