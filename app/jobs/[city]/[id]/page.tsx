import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";

type PageProps = {
  params: Promise<{ city: string; id: string }>;
};

export default async function JobPage({ params }: PageProps) {
  const { city, id } = await params;

  const db = getDb();
  const doc = await db.collection("Jobs").doc(id).get();

  if (!doc.exists) return notFound();

  const job = doc.data() as any;

  if (job?.status && job.status !== "approved") return notFound();
  if (job?.approved === false) return notFound();

  const title = job?.title || "Job Opportunity";
  const company = job?.companyName || job?.company || "Company";
  const description = job?.description || "No description provided.";
  const location = job?.city || job?.jobCity || city;
  const salary = job?.salary || "Not specified";
  const jobType = job?.jobType || "Not specified";

  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    hiringOrganization: {
      "@type": "Organization",
      name: company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "NA",
      },
    },
    datePosted:
      job?.createdAt?.toDate?.()?.toISOString?.() ??
      job?.postedAt?.toDate?.()?.toISOString?.() ??
      new Date().toISOString(),
  };

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <h1>{title}</h1>
      <p>
        <b>{company}</b> — {location}
      </p>

      <p>
        <b>Job Type:</b> {jobType}
      </p>

      <p>
        <b>Salary:</b> {salary}
      </p>
      
      <p style={{ marginTop: 20 }}>
  <a
    href={`https://seo.job-hook.com/j/Jobs/${params.id}`}
    style={{
      display: "inline-block",
      padding: "12px 20px",
      background: "#8b7cf6",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "10px",
      fontWeight: 600,
    }}
  >
    Open in JobHook App
  </a>
</p>

      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, marginTop: 18 }}>
        {description}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}