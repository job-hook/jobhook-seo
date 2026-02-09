export default function Home() {
  return (
    <main style={{ padding: 30, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, marginBottom: 10 }}>JobHook</h1>
      <p style={{ fontSize: 18, maxWidth: 700, lineHeight: 1.6 }}>
        Find jobs in Namibia faster. Search by city, category, or “hiring now”.
        This site is the SEO engine that will send traffic into the JobHook app.
      </p>

      <div style={{ marginTop: 25, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href="/jobs/windhoek">Jobs in Windhoek</a>
        <a href="/jobs/swakopmund">Jobs in Swakopmund</a>
        <a href="/jobs/hiring-now">Hiring Now</a>
        <a href="/jobs/no-experience">No Experience</a>
      </div>

      <p style={{ marginTop: 30, opacity: 0.7 }}>
        Next step: we’ll create these pages dynamically so Google can index thousands of pages.
      </p>
    </main>
  );
}
