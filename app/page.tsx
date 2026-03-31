import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay, Swakopmund, Oshakati and more. Apply easily on JobHook.",
};

export default function HomePage() {
  return (
    <main style={{ padding: 30, fontFamily: "system-ui", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>Find Jobs in Namibia</h1>

      <p style={{ fontSize: 18, maxWidth: 800, lineHeight: 1.6 }}>
        Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay,
        Swakopmund, Oshakati and more. Apply easily on JobHook.
      </p>

      <div style={{ marginTop: 30 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Browse Jobs by City</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/jobs/windhoek">Jobs in Windhoek</Link>
          <Link href="/jobs/walvis-bay">Jobs in Walvis Bay</Link>
          <Link href="/jobs/swakopmund">Jobs in Swakopmund</Link>
          <Link href="/jobs/oshakati">Jobs in Oshakati</Link>
          <Link href="/jobs">All Jobs in Namibia</Link>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Why JobHook</h2>

        <p style={{ fontSize: 18, maxWidth: 850, lineHeight: 1.6 }}>
          JobHook helps job seekers discover new opportunities across Namibia in one place.
          Explore current openings, browse by city, and apply through the JobHook platform.
        </p>
      </div>
    </main>
  );
}