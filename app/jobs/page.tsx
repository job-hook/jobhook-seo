import Link from "next/link";
import { CITIES } from "../data/cities";

export const metadata = {
  title: "Latest Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia including Windhoek, Walvis Bay, Swakopmund, Oshakati and more. Browse job opportunities and apply easily on JobHook.",
};

export default function JobsHome() {
  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Jobs in Namibia</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
Find the latest job opportunities across Namibia. Browse jobs in Windhoek,
Walvis Bay, Swakopmund, Oshakati and other cities. JobHook connects job
seekers with employers hiring now.
</p>

<div style={{ marginTop: 30 }}>
  <h2 style={{ fontSize: 22, marginBottom: 10 }}>Popular Job Searches</h2>

  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
    
    <Link href="/jobs/security">
      Security Jobs Namibia
    </Link>

    <Link href="/jobs/driver">
      Driver Jobs Namibia
    </Link>

    <Link href="/jobs/cleaner">
      Cleaning Jobs Namibia
    </Link>

    <Link href="/jobs/government">
      Government Jobs Namibia
    </Link>

    <Link href="/jobs/no-experience">
      No Experience Jobs Namibia
    </Link>

  </div>
</div>

<div style={{ marginTop: 40 }}>
  <h2 style={{ fontSize: 22, marginBottom: 10 }}>Latest Jobs</h2>

  <p style={{ maxWidth: 700 }}>
    Browse the most recently posted jobs across Namibia. These listings are
    updated daily as employers publish new opportunities on JobHook.
  </p>
</div>

      <div style={{ marginTop: 25, display: "flex", gap: 12, flexWrap: "wrap" }}>
  {CITIES.map((city) => (
    <Link
  key={city}
  href={`/jobs/${city}`}
  className="city-link"
>
      Jobs in {city.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
    </Link>
  ))}
</div>


      <p style={{ marginTop: 30, opacity: 0.7 }}>
        Next step: we’ll generate these pages dynamically so Google can index thousands of job pages.
      </p>
    </main>
  );
}
