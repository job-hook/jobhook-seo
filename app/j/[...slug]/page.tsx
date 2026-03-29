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

  const collection = slug[0];
  const jobId = slug[1];

  if (collection !== "jobs" || !jobId) {
    redirect("/");
  }

  const db = getDb();
  const jobSnap = await db.collection("jobs").doc(jobId).get();

  if (!jobSnap.exists) {
    redirect("/");
  }

  const job = jobSnap.data();
  const city = String(job?.jobCity || "").trim().toLowerCase().replace(/\s+/g, "-");

  if (!city) {
    redirect("/jobs");
  }

  redirect(`/jobs/${city}/${jobId}`);
}