import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { profile, experiences, skills, services, socialLinks, taglines, faqs } from "@/db/schema";
import type { Experience, Skill, Service, Faq } from "@/db/schema";
import { getProjects } from "@/lib/projects";
import type { MergedProject } from "@/lib/projects";

// Company pages have no fallback personal portrait.
const FALLBACK_AVATAR = "";

// ── Public row types ────────────────────────────────────────────────────────

export type ExperienceRow = Experience;
export type SkillRow = Skill;
export type ServiceRow = Service;

export type SocialRow = {
  platform: string;
  url: string;
  username: string;
  order: number;
};

// ── Re-export ────────────────────────────────────────────────────────────────

export type { MergedProject };
export { getProjects as getProjectsMerged };

// ── Helpers ──────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<{
  name: string;
  bio: string;
  roles: string[];
  avatarUrl: string;
  resumeUrl: string;
  heroTagline: string | null;
  sectionVisibility: Record<string, boolean>;
  stats: { years: number; repos: number; stars: number; followers: number };
}> {
  const rows = await db.select().from(profile);
  const row = rows[0];
  if (!row) throw new Error("Profile row not found");

  const s = row.stats as Record<string, unknown>;

  // Company figures come only from authored content, never a template owner account.
  const followers = Number(s.followers ?? 0);
  const repos = Number(s.repos ?? 0);
  const stars = Number(s.stars ?? 0);

  const years = Number(s.years ?? 0);

  return {
    name: row.name,
    bio: row.bio,
    avatarUrl: (row.avatarUrl as string) || FALLBACK_AVATAR,
    resumeUrl: (row.resumeUrl as string) ?? "",
    heroTagline: row.heroTagline ?? null,
    sectionVisibility: (row.sectionVisibility as Record<string, boolean>) ?? {},
    roles: row.roles,
    stats: { years, repos, stars, followers },
  };
}

export async function getExperiences(): Promise<ExperienceRow[]> {
  const rows = await db.select().from(experiences).orderBy(asc(experiences.order));
  return rows.filter((row) => Boolean(row.contributor));
}

export async function getSkills(): Promise<SkillRow[]> {
  return db.select().from(skills).orderBy(asc(skills.order));
}

export async function getServices(): Promise<ServiceRow[]> {
  return db.select().from(services).orderBy(asc(services.order));
}

export type FaqRow = Faq;

export async function getFaqs(): Promise<FaqRow[]> {
  return db.select().from(faqs).orderBy(asc(faqs.order));
}

export async function getSocialLinks(): Promise<SocialRow[]> {
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.order));
  return rows.map((r) => ({
    platform: r.platform,
    url: r.url,
    username: r.username ?? "",
    order: r.order,
  }));
}

// The pick happens in JS, so the tagline rotates once per ISR regeneration rather than per
// visitor - see the revalidate window in app/page.tsx.
export async function getRandomTagline(): Promise<string> {
  const rows = await db.select().from(taglines).where(eq(taglines.active, true));
  if (rows.length === 0) return "Tecnología que impulsa tu negocio";
  const pick = rows[Math.floor(Math.random() * rows.length)];
  return pick.text;
}
