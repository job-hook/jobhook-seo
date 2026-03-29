import { redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";

export default async function JobRedirectPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params.slug;

  if (!slug || slug.length < 2) {
    redirect("/");
  }

  const collection = String(slug[0] || "").toLowerCase();
  const jobId = slug[1];

  if (collection !== "jobs" || !jobId) {
    redirect("/");
  }

  const db = getDb();
  const jobSnap = await db.collection("Jobs").doc(jobId).get();

  if (!jobSnap.exists) {
    redirect("/");
  }

  const job = jobSnap.data() as any;

  const city = String(job?.city || job?.jobCity || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (!city) {
    redirect("/jobs");
  }

  redirect(`/jobs/${city}/${jobId}`);
}