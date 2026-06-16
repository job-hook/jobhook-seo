export type JobRecord = {
  id: string;
  [key: string]: unknown;
};

type DataRecord = Record<string, unknown>;
type DateLike = Date | string | number | { toDate?: () => Date } | null | undefined;

const CITY_ALIASES: Record<string, string> = {
  aradis: "arandis",
  oragemund: "oranjemund",
};

const ACTIVE_STATUSES = new Set([
  "active",
  "approved",
  "live",
  "open",
  "published",
]);

const INACTIVE_STATUSES = new Set([
  "archived",
  "closed",
  "deleted",
  "draft",
  "expired",
  "inactive",
  "pending",
  "rejected",
  "removed",
]);

function hasToDate(value: unknown): value is { toDate: () => Date } {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  );
}

function getStringField(record: unknown, keys: string[]) {
  if (!record || typeof record !== "object") return "";
  const data = record as DataRecord;

  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return value.toString();
  }

  return "";
}

export function toSafeDate(value: unknown): Date | null {
  if (!value) return null;
  if (hasToDate(value)) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isActiveJob(job: DataRecord, now = new Date()) {
  const expireDate = toSafeDate(
    (job.expireAt || job.expiresAt || job.expiryDate) as DateLike
  );

  if (expireDate && expireDate <= now) return false;
  if (job.approved === false || job.isApproved === false) return false;
  if (job.active === false || job.isActive === false) return false;

  const status = String(job.status || job.jobStatus || "")
    .trim()
    .toLowerCase();

  if (status && INACTIVE_STATUSES.has(status)) return false;
  if (status && !ACTIVE_STATUSES.has(status)) return false;

  return true;
}

function cityString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return getStringField(value, [
      "city",
      "town",
      "name",
      "addressLocality",
      "locality",
    ]);
  }

  return value.toString();
}

export function getJobCity(job: DataRecord) {
  return (
    cityString(job.jobCity) ||
    cityString(job.city) ||
    cityString(job.cityName) ||
    cityString(job.town) ||
    cityString(job.jobTown) ||
    cityString(job.location) ||
    cityString(job.jobLocation)
  );
}

export function normalizeCitySlug(value: unknown) {
  const raw = cityString(value).trim();
  const firstPlace = raw.includes(",") ? raw.split(",")[0] : raw;

  const slug = firstPlace
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return CITY_ALIASES[slug] || slug;
}

export function prettifyCity(slug: string) {
  return normalizeCitySlug(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getJobCitySlug(job: DataRecord) {
  return normalizeCitySlug(getJobCity(job));
}

export function getPostedMs(jobOrValue: unknown) {
  const record =
    jobOrValue &&
    typeof jobOrValue === "object" &&
    !(jobOrValue instanceof Date) &&
    !hasToDate(jobOrValue)
      ? (jobOrValue as DataRecord)
      : null;
  const value =
    record ? record.postedAt || record.createdAt || record.datePosted : jobOrValue;
  const date = toSafeDate(value);

  return date ? date.getTime() : 0;
}

export function formatPostedAge(value: unknown) {
  const date = toSafeDate(value);
  if (!date) return "Recently posted";

  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const postedDate = date.toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (minutes < 60) return `${postedDate} (just posted)`;
  if (hours < 24) return `${postedDate} (${hours}h ago)`;
  if (days === 1) return `${postedDate} (1 day ago)`;
  return `${postedDate} (${days} days ago)`;
}

export function jobDetailPath(job: JobRecord) {
  const citySlug = getJobCitySlug(job);
  return citySlug ? `/jobs/${citySlug}/${job.id}` : `/jobs/namibia/${job.id}`;
}

export function matchesJobSearch(job: DataRecord, query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return true;

  const haystack = [
    job.title,
    job.companyName,
    job.company,
    getJobCity(job),
    job.jobType,
    job.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

export function textValue(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return value.toString();
  return fallback;
}

export function getJobTitle(job: DataRecord) {
  return textValue(job.title, "Job Opportunity");
}

export function getCompany(job: DataRecord) {
  return textValue(job.companyName, textValue(job.company, "Company"));
}

export function getJobType(job: DataRecord) {
  return textValue(job.jobType, "Not specified");
}

export function getSalary(job: DataRecord) {
  return textValue(job.salary, "Not specified");
}

export function getDescription(job: DataRecord) {
  return textValue(job.description, "No description provided.");
}
