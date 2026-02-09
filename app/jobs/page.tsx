import Link from "next/link";
import { CITIES } from "../data/cities";

export const metadata = {
  title: "JobHook Jobs | Browse Jobs by City",
  description: "Browse JobHook jobs by city in Namibia. Find jobs hiring now and entry-level opportunities.",
};

export default function JobsHome() {
  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>JobHook Jobs</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
        Welcome to the JobHook jobs hub. This is where Google will discover our job pages.
        Choose a city or category below — these pages are built for fast searching and SEO.
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
