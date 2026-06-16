import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import {
  formatPostedAge,
  getCompany,
  getDescription,
  getJobCity,
  getJobTitle,
  getJobType,
  getSalary,
  isActiveJob,
  normalizeCitySlug,
  prettifyCity,
  toSafeDate,
} from "@/lib/seoJobs";

type PageProps = {
  params: Promise<{ city: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: rawCity, id } = await params;
  const citySlug = normalizeCitySlug(rawCity);
  const city = citySlug ? prettifyCity(citySlug) : "Namibia";
  const db = getDb();
  const doc = await db.collection("Jobs").doc(id).get();

  if (!doc.exists) {
    return {
      title: "Job Opportunity | JobHook",
      description: "Find the latest job opportunities on JobHook.",
    };
  }

  const job = doc.data() as Record<string, unknown>;

  if (!isActiveJob(job)) {
    return {
      title: "Job no longer available | JobHook",
      description: "Browse active job opportunities on JobHook.",
    };
  }

  return {
    title:
      city === "Namibia"
        ? `${getJobTitle(job)} in Namibia | JobHook`
        : `${getJobTitle(job)} in ${city}, Namibia | JobHook`,
    description: getDescription(job).slice(0, 150) || `Find jobs in ${city} on JobHook.`,
  };
}

export default async function JobPage({ params }: PageProps) {
  const { city: rawCity, id } = await params;
  const citySlug = normalizeCitySlug(rawCity);
  const city = citySlug ? prettifyCity(citySlug) : "Namibia";

  const db = getDb();
  const doc = await db.collection("Jobs").doc(id).get();

  if (!doc.exists) return notFound();

  const job = doc.data() as Record<string, unknown>;

  if (!isActiveJob(job)) return notFound();

  const title = getJobTitle(job);
  const company = getCompany(job);
  const description = getDescription(job);
  const location = getJobCity(job) || city;
  const salary = getSalary(job);
  const jobType = getJobType(job);
  const postedDate =
    toSafeDate(job?.postedAt || job?.createdAt || job?.datePosted) || new Date();

  const jobStructuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted: postedDate.toISOString(),
    validThrough: toSafeDate(job?.expireAt || job?.expiresAt)?.toISOString(),
    employmentType: jobType,
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
    baseSalary: salary
      ? {
          "@type": "MonetaryAmount",
          currency: "NAD",
          value: {
            "@type": "QuantitativeValue",
            value: salary,
            unitText: "MONTH",
          },
        }
      : undefined,
  };

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
          <b>{company}</b> - {location}
        </p>

        <p>
          <b>Job Type:</b> {jobType}
        </p>

        <p>
          <b>Salary:</b> {salary}
        </p>

        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "6px" }}>
          Posted: {formatPostedAge(postedDate)}
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
      </main>
    </>
  );
}
