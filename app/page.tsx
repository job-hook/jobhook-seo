import { getDb } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay, Swakopmund, Oshakati and more. Apply easily on JobHook.",
};

async function getJobs() {
  const db = getDb();

  const snapshot = await db.collection("jobs").limit(6).get();

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export default async function HomePage() {
  const jobs = await getJobs();
  return  (
  <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
    <section style={{ marginBottom: "40px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Find Jobs in Namibia
      </h1>

      <p style={{ color: "#555", marginTop: "10px" }}>
        Discover real job opportunities in Windhoek, Walvis Bay, Swakopmund and more.
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Browse Jobs
      </button>
    </section>

    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Browse Jobs by City</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {[
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
        ].map((city) => (
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

      <div style={{ marginTop: "20px" }}>
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
          View All Jobs
        </Link>
      </div>
    </section>

    <section style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Latest Jobs</h2>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.map((job: any) => (
          <div
            key={job.id}
            style={{
              padding: "15px",
              border: "1px solid #eee",
              borderRadius: "10px",
            }}
          >
            <h3>{job.title}</h3>

            <p style={{ color: "#666" }}>
              {job.company || "private employer"}
            </p>

            <p style={{ color: "#666" }}>
              {job.jobCity} • {job.jobType}
            </p>

            <p style={{ marginTop: "8px" }}>
              {job.description?.slice(0, 100)}...
            </p>

            <p style={{ fontSize: "12px", color: "#999", marginTop: "6px" }}>
  Posted {new Date(job.postedAt).toLocaleDateString()}
</p>

            <Link
              href={`/jobs/${job.jobCity?.toLowerCase()}/${job.id}`}
            >
              <button style={{ marginTop: "10px" }}>
                View Job
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  </main>
);
}