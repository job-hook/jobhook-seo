import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Jobs in Namibia | JobHook",
  description:
    "Find the latest jobs in Namibia. Browse opportunities in Windhoek, Walvis Bay, Swakopmund, Oshakati and more. Apply easily on JobHook.",
};

export default function HomePage() {
  return (
    <main style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      
      {/* HERO */}
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

      {/* CITY BUTTONS */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Browse Jobs by City</h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
          {["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati", "Ongwediva", "Rundu", "Katima Mulilo", "Otjiwarongo", "Okahandja", "Keetmanshoop", "Gobabis", "Mariental",].map((city) => (
            <a
              key={city}
              href={`/jobs/${city.toLowerCase().replace(" ", "-")}`}
              style={{
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "black",
                background: "#f9f9f9",
              }}
            >
              View All Jobs
              {city}
            </a>
          ))}
        </div>
      </section>

      {/* JOB PREVIEW (IMPORTANT) */}
      <section>
        <h2>Latest Jobs</h2>

        <div style={{ marginTop: "20px", display: "grid", gap: "15px" }}>
          
          {/* Example Job Card */}
          <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
            <h3>Security Guard</h3>
            <p style={{ color: "#666" }}>Windhoek • Full-time</p>
            <p style={{ marginTop: "8px" }}>
              Looking for a reliable security guard to join our team.
            </p>
          </div>

          <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px" }}>
            <h3>Shop Assistant</h3>
            <p style={{ color: "#666" }}>Walvis Bay • Part-time</p>
            <p style={{ marginTop: "8px" }}>
              Assist customers and manage daily store operations.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}