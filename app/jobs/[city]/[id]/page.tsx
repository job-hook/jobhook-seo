import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";

type PageProps = {
  params: Promise<{ city: string; id: string }>;
};

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city, id } = await params;
  const db = getDb();
 const doc = await db.collection("Jobs").doc(id).get();

 if (!doc.exists) {
  return {
    title: "Job Opportunity | JobHook",
    description: "Find the latest job opportunities on JobHook."
  }
}

  const job = doc.data() as any;
return {
  title: `${job?.title || "Job"} in ${city} | JobHook`,
  description:
    job?.description?.slice(0, 150) ||
    `Find jobs in ${city} on JobHook.`,
};
}

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

  const jobStructuredData = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description,
  datePosted: new Date().toISOString(),
  employmentType: job.jobType || "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: job.company,
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "NA",
    },
  },
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "NAD",
    value: {
      "@type": "QuantitativeValue",
      value: job.salary || 0,
      unitText: "MONTH",
    },
  },
}

  return (
    <>
    
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jobStructuredData),
  }}
/>
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

      <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
  Posted: {job.postedAt ? getTimeAgo(job.postedAt.toDate()) : "Recently posted"}
</p>


      
      <p style={{ marginTop: "20px" }}>

        <a
  href={`https://job-hook.com/job/${id}`}
  target="_blank"
  rel="noopener noreferrer"
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
  Apply Now
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
    </>
  );
}
