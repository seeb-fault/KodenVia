"use client";

import { useState, useTransition } from "react";
import {
  User,
  Wrench,
  Briefcase,
  FolderGit2,
  Sparkles,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { setSectionVisibility } from "@/app/admin/actions";

// Each toggleable homepage section, with an icon and a plain description of what
// it shows - so the control reads as "what appears on my site", not raw keys.
const SECTIONS: { id: string; label: string; description: string; icon: LucideIcon }[] = [
  {
    id: "about",
    label: "Equipo",
    description: "Presentación y perfiles de los socios",
    icon: User,
  },
  {
    id: "skills",
    label: "Tecnologías",
    description: "Tecnologías y herramientas del equipo",
    icon: Wrench,
  },
  {
    id: "experience",
    label: "Trayectoria",
    description: "Experiencia y trabajos previos de cada socio",
    icon: Briefcase,
  },
  {
    id: "projects",
    label: "Proyectos",
    description: "Proyectos y aportes del equipo",
    icon: FolderGit2,
  },
  {
    id: "services",
    label: "Servicios",
    description: "Soluciones que ofrecemos a los clientes",
    icon: Sparkles,
  },
  {
    id: "testimonials",
    label: "Testimonios",
    description: "Referencias sobre el trabajo del equipo",
    icon: MessageSquareQuote,
  },
  {
    id: "faq",
    label: "Preguntas frecuentes",
    description: "Respuestas a las dudas más comunes",
    icon: HelpCircle,
  },
  { id: "contact", label: "Contacto", description: "Cómo comunicarse con Kodenvia", icon: Mail },
];

// Normalize the stored map to an explicit on/off per section (missing = visible).
function toState(visibility: Record<string, boolean>): Record<string, boolean> {
  return Object.fromEntries(SECTIONS.map((s) => [s.id, visibility[s.id] !== false]));
}

/**
 * Saves optimistically on flip, rolling back if it fails. A hidden section is not rendered,
 * code-split or data-fetched on the site at all.
 */
export function SectionVisibilityToggles({ visibility }: { visibility: Record<string, boolean> }) {
  const [state, setState] = useState(() => toState(visibility));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const toggle = (id: string) => {
    const next = !state[id];
    const prev = state[id];
    setState((s) => ({ ...s, [id]: next })); // optimistic
    setPendingId(id);
    startTransition(async () => {
      try {
        await setSectionVisibility({ [id]: next });
      } catch {
        setState((s) => ({ ...s, [id]: prev })); // rollback on failure
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <ul className="divide-border divide-y">
      {SECTIONS.map((s) => {
        const on = state[s.id];
        const Icon = s.icon;
        return (
          <li key={s.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                on ? "bg-(image:--gradient-brand) text-white" : "bg-foreground/10 text-muted",
              )}
            >
              <Icon className="size-4.5" aria-hidden />
            </span>

            <div className="min-w-0 flex-1">
              <div className="text-foreground text-sm font-medium">{s.label}</div>
              <div className="text-muted truncate text-xs">{s.description}</div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={on}
              aria-label={`Sección ${s.label}: ${on ? "visible" : "oculta"}`}
              onClick={() => toggle(s.id)}
              disabled={pendingId === s.id}
              className={cn(
                "focus-visible:ring-ring relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60",
                on ? "bg-(image:--gradient-brand)" : "bg-foreground/20",
              )}
            >
              <span
                className={cn(
                  "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
                  on ? "translate-x-[22px]" : "translate-x-0.5",
                )}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
