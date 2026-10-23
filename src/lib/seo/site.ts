import { requirePublicEnv } from "@/lib/env";
import { TEAM_MEMBERS } from "@/lib/team";

export const SITE = {
  // Canonical site origin, env-driven with no
  // hardcoded fallback. Fails the build loudly on the server if missing; on the
  // client it never throws (would crash hydration) since Next inlines the value.
  url: requirePublicEnv("NEXT_PUBLIC_SITE_URL"),
  name: "Kodenvia",
  title: "Kodenvia - Desarrollo web, aplicaciones y automatización",
  description:
    "Somos Kodenvia, un equipo de dos socios que transforma ideas en páginas web, aplicaciones y automatizaciones a medida para tu negocio.",
  tagline: "Tecnología que impulsa tu negocio",
  email: "sebbfaultsoul@gmail.com",
  phone: "+51 945 984 518",
  whatsapp: "https://wa.me/51945984518",
  founders: TEAM_MEMBERS.map((member) => member.name),
  handle: undefined,
  sameAs: [] as string[],
} as const;
