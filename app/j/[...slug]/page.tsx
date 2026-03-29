import { redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function JobRedirectPage({ params }: PageProps) {
  const { slug = [] } = await params;

  if (slug.length < 2) {
    redirect("/");
  }

  const collection = String(slug[0] || "").toLowerCase();
  const jobId = String(slug[1] || "");

  if (collection !== "jobs" || !jobId) {
    redirect("/");
  }

  const db = getDb();
  const jobSnap = await db.collection("Jobs").doc(jobId).get();

  if (!jobSnap.exists) {
    redirect("/");
  }

  const job = jobSnap.data() as Record<string, unknown>;
  const city = String(job?.city || job?.jobCity || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (!city) {
    redirect("/jobs");
  }

  redirect(`/jobs/${city}/${jobId}`);
}