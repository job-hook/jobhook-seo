import Link from "next/link";
import { CITIES } from "../data/cities";

export const metadata = {
  title: "Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia including Windhoek, Walvis Bay, Swakopmund and Oshakati. Security jobs, driver jobs, cleaning jobs and more on JobHook.",
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
