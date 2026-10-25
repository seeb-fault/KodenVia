import Link from "next/link";
import { sql } from "drizzle-orm";
import {
  FolderGit2,
  Briefcase,
  Wrench,
  Sparkles,
  Link2,
  HelpCircle,
  MessageSquareQuote,
  Quote,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { db } from "@/db/client";
import {
  profile,
  projects,
  experiences,
  skills,
  services,
  socialLinks,
  faqs,
  taglines,
  testimonials,
} from "@/db/schema";
export const dynamic = "force-dynamic";

// One count card per collection-style section in the sidebar. Profile is a
// singleton (handled separately) and Testimonials gets its own moderation
// panel, so the total card links straight to the queue.
const cards = [
  { href: "/admin/projects", label: "Proyectos", icon: FolderGit2, key: "projects" },
  { href: "/admin/experiences", label: "Trayectoria", icon: Briefcase, key: "experiences" },
  { href: "/admin/skills", label: "Tecnologías", icon: Wrench, key: "skills" },
  { href: "/admin/services", label: "Servicios", icon: Sparkles, key: "services" },
  { href: "/admin/social-links", label: "Redes y contacto", icon: Link2, key: "socialLinks" },
  { href: "/admin/faqs", label: "Preguntas frecuentes", icon: HelpCircle, key: "faqs" },
  { href: "/admin/taglines", label: "Lemas", icon: Quote, key: "taglines" },
  {
    href: "/admin/testimonials",
    label: "Testimonios",
    icon: MessageSquareQuote,
    key: "testimonials",
  },
] as const;

const count = sql<number>`count(*)`;

export default async function AdminDashboard() {
  // One round-trip: a count per table, plus the testimonial status breakdown
  // resolved in a single scan via FILTER.
  const [
    [proj],
    [exp],
    [skl],
    [svc],
    [social],
    [faq],
    [tagline],
    [profileRow],
    [testimonialStats],
  ] = await Promise.all([
    db.select({ n: count }).from(projects),
    db.select({ n: count }).from(experiences),
    db.select({ n: count }).from(skills),
    db.select({ n: count }).from(services),
    db.select({ n: count }).from(socialLinks),
    db.select({ n: count }).from(faqs),
    db.select({ n: count }).from(taglines),
    db.select({ id: profile.id }).from(profile).limit(1),
    db
      .select({
        total: count,
        approved: sql<number>`count(*) filter (where ${testimonials.status} = 'approved')`,
        pending: sql<number>`count(*) filter (where ${testimonials.status} = 'pending')`,
        rejected: sql<number>`count(*) filter (where ${testimonials.status} = 'rejected')`,
      })
      .from(testimonials),
  ]);

  const counts: Record<string, number> = {
    projects: Number(proj.n),
    experiences: Number(exp.n),
    skills: Number(skl.n),
    services: Number(svc.n),
    socialLinks: Number(social.n),
    faqs: Number(faq.n),
    taglines: Number(tagline.n),
    testimonials: Number(testimonialStats.total),
  };
  const profileConfigured = Boolean(profileRow);
  const approvedCount = Number(testimonialStats.approved);
  const pendingCount = Number(testimonialStats.pending);
  const rejectedCount = Number(testimonialStats.rejected);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Resumen</h1>
        <p className="text-muted mt-1 text-sm">Administra el contenido del sitio de Kodenvia.</p>
      </div>

      {/* Stat cards — one per content section */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="border-border bg-surface hover:border-foreground/20 hover:bg-surface-2 flex flex-col gap-3 rounded-2xl border p-5 transition"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-(image:--gradient-brand) text-white">
                <Icon className="size-4.5" aria-hidden />
              </span>
              <div>
                <div className="text-foreground text-2xl font-bold tabular-nums">
                  {counts[c.key]}
                </div>
                <div className="text-muted text-sm">{c.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Profile status + testimonials moderation */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          href="/admin/profile"
          className="border-border bg-surface hover:border-foreground/20 hover:bg-surface-2 flex items-center justify-between gap-4 rounded-2xl border p-5 transition"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-10 place-items-center rounded-xl bg-(image:--gradient-brand) text-white">
              <User className="size-5" aria-hidden />
            </span>
            <div>
              <div className="text-foreground font-semibold">Empresa</div>
              <div className="text-muted text-sm">
                Nombre, presentación y documento de la empresa
              </div>
            </div>
          </div>
          {profileConfigured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-500">
              <CheckCircle2 className="size-3.5" aria-hidden />
              Configurado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2.5 py-1 text-xs font-medium text-amber-500">
              <Clock className="size-3.5" aria-hidden />
              Sin configurar
            </span>
          )}
        </Link>

        <Link
          href="/admin/testimonials"
          className="border-border bg-surface hover:border-foreground/20 hover:bg-surface-2 flex items-center justify-between gap-4 rounded-2xl border p-5 transition"
        >
          <div className="flex items-center gap-4">
            <span className="grid size-10 place-items-center rounded-xl bg-(image:--gradient-brand) text-white">
              <MessageSquareQuote className="size-5" aria-hidden />
            </span>
            <div>
              <div className="text-foreground font-semibold">Testimonios</div>
              <div className="text-muted text-sm">
                {approvedCount} {approvedCount === 1 ? "publicado" : "publicados"} · {pendingCount}{" "}
                {pendingCount === 1 ? "pendiente" : "pendientes"} · {rejectedCount}{" "}
                {rejectedCount === 1 ? "rechazado" : "rechazados"}
              </div>
            </div>
          </div>
          {pendingCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 px-2.5 py-1 text-xs font-medium text-amber-500">
              <Clock className="size-3.5" aria-hidden />
              {pendingCount} {pendingCount === 1 ? "pendiente" : "pendientes"}
            </span>
          ) : null}
        </Link>
      </div>
    </div>
  );
}
