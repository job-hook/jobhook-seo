import type { Metadata } from "next";

const baseUrl = process.env.SITE_URL || "http://localhost:3000";

type PageProps = {
  params: Promise<{ city: string; id: string }>;
};

function prettyCity(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, id } = await params;

  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettyCity(citySlug) : "Unknown City";

  const title = `Job ${id} in ${cityName} | JobHook`;
  const description = `View job ${id} in ${cityName}, Namibia. Apply on JobHook.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/jobs/${citySlug}/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/jobs/${citySlug}/${id}`,
      siteName: "JobHook",
      type: "website",
    },
  };
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { city, id } = await params;

  const baseUrl = process.env.SITE_URL || "http://localhost:3000";
  const citySlug = (city || "").toLowerCase();
  const cityName = citySlug ? prettyCity(citySlug) : "Unknown City";

  // ✅ Placeholder job data for now (later we replace this with real DB data)
  const job = {
    
    id,
    title: `Sample Job Title ${id}`,
    description:
      "This is a sample job description. Later we will load real jobs from your database.",
    companyName: "JobHook Demo Company",
    employmentType: "FULL_TIME",
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // +30 days
    streetAddress: "Independence Avenue",
    addressLocality: cityName,
    addressRegion: "Khomas",
    postalCode: "9000",
    addressCountry: "NA",
    salaryCurrency: "NAD",
    salaryValue: 8000,
  };

      const datePostedISO = new Date(job.datePosted).toISOString(); // from DB (recommended)
const validThroughISO = new Date(
  new Date(job.datePosted).getTime() + 30 * 24 * 60 * 60 * 1000
).toISOString();

const jobPostingSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: job.title,
  description: job.description,
  datePosted: datePostedISO,
  validThrough: validThroughISO, // NOT shown to users, but good for Google
  employmentType: job.employmentType || "FULL_TIME",
  hiringOrganization: {
    "@type": "Organization",
    name: job.companyName || "JobHook Employer",
    sameAs: baseUrl,
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "NA",
    },
  },
  identifier: {
    "@type": "PropertyValue",
    name: "JobHook",
    value: String(job.id),
  },
  url: `${baseUrl}/jobs/${citySlug}/${job.id}`,
};

  // ✅ Google Jobs structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: "JobHook",
      value: job.id,
    },
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      sameAs: baseUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.streetAddress,
        addressLocality: job.addressLocality,
        addressRegion: job.addressRegion,
        postalCode: job.postalCode,
        addressCountry: job.addressCountry,
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency,
      value: {
        "@type": "QuantitativeValue",
        value: job.salaryValue,
        unitText: "MONTH",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Namibia",
    },
  };

  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      {/* ✅ JSON-LD injected into the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 style={{ fontSize: 40, marginBottom: 10 }}>{job.title}</h1>
      <p style={{ opacity: 0.8 }}>
        {cityName}, Namibia • {job.employmentType.replace("_", " ")}
      </p>

      <p style={{ marginTop: 20, maxWidth: 900, lineHeight: 1.6 }}>
        {job.description}
      </p>

      <p style={{ marginTop: 20 }}>
        Salary: {job.salaryCurrency} {job.salaryValue}/month
      </p>

      <a
        href={`${baseUrl}/apply/${citySlug}/${id}`}
        style={{
          display: "inline-block",
          marginTop: 25,
          padding: "12px 16px",
          border: "1px solid #ddd",
          borderRadius: 12,
          textDecoration: "none",
        }}
      >
        Apply Now
      </a>

      <div style={{ marginTop: 30 }}>
        <a href={`/jobs/${citySlug}`} style={{ textDecoration: "none" }}>
          ← Back to jobs in {cityName}
        </a>
      </div>
    </main>
  );
}
