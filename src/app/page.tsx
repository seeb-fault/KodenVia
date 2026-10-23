import nextDynamic from "next/dynamic";
import {
  getProfile,
  getProjectsMerged,
  getExperiences,
  getSkills,
  getServices,
  getSocialLinks,
  getRandomTagline,
} from "@/lib/queries";
import { Hero } from "@/components/home/Hero";
import { SiteNav } from "@/components/navbar/SiteNav";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/seo/site";

// ISR: prerendered at build time, so the build needs a reachable database. 12h is a Neon compute
// budget decision, not a freshness one - admin saves publish immediately. See AGENTS.md.
export const revalidate = 43200;

// Below-the-fold sections: lazy-loaded to keep the hero bundle lean.
// Note: These are Server Components — next/dynamic with ssr:true (default)
// performs code-splitting without disabling server rendering.
const About = nextDynamic(() =>
  import("@/components/home/About").then((m) => ({ default: m.About })),
);
const Skills = nextDynamic(() =>
  import("@/components/home/Skills").then((m) => ({ default: m.Skills })),
);
const Experience = nextDynamic(() =>
  import("@/components/home/Experience").then((m) => ({ default: m.Experience })),
);
const Projects = nextDynamic(() =>
  import("@/components/home/Projects").then((m) => ({ default: m.Projects })),
);
const Services = nextDynamic(() =>
  import("@/components/home/Services").then((m) => ({ default: m.Services })),
);
const TestimonialsSection = nextDynamic(() =>
  import("@/components/sections/TestimonialsSection").then((m) => ({
    default: m.TestimonialsSection,
  })),
);
const Contact = nextDynamic(() =>
  import("@/components/home/Contact").then((m) => ({ default: m.Contact })),
);
const Faq = nextDynamic(() =>
  import("@/components/sections/FaqSection").then((m) => ({ default: m.FaqSection })),
);
export default async function Home() {
  // Profile gates everything and feeds the always-on Hero, so it loads first.
  // A section is visible unless its key is explicitly false.
  const profile = await getProfile();
  const vis = profile.sectionVisibility;
  const show = (id: string) => vis[id] !== false;

  // Fetch only the data for VISIBLE sections - a hidden section runs no query
  // (and its component chunk never loads via the gated dynamic import below).
  // Social links are shared by navigation, contact and footer.
  const [projects, experiences, skills, services, socials, tagline] = await Promise.all([
    show("projects") ? getProjectsMerged() : Promise.resolve([]),
    show("experience") ? getExperiences() : Promise.resolve([]),
    show("skills") ? getSkills() : Promise.resolve([]),
    show("services") ? getServices() : Promise.resolve([]),
    getSocialLinks(),
    getRandomTagline(),
  ]);

  // Derive contact email from social links (platform = "email") or fall back
  const contactEmail =
    socials.find((s) => s.platform.toLowerCase() === "email")?.url.replace("mailto:", "") ??
    SITE.email;

  return (
    <>
      <SiteNav
        tagline={tagline}
        socials={socials.map((s) => ({ platform: s.platform, url: s.url }))}
        hidden={Object.entries(vis)
          .filter(([, v]) => v === false)
          .map(([k]) => k)}
      />

      <Hero
        profile={{ name: profile.name, roles: profile.roles }}
        heroTagline={profile.heroTagline}
      />

      {show("about") && (
        <About
          profile={{
            bio: profile.bio,
            stats: profile.stats,
            name: profile.name,
            avatarUrl: profile.avatarUrl,
          }}
        />
      )}

      {show("services") && <Services services={services} />}

      {show("skills") && <Skills skills={skills} />}

      {show("projects") && <Projects projects={projects} />}

      {show("experience") && <Experience experiences={experiences} />}

      {show("testimonials") && <TestimonialsSection />}

      {show("faq") && <Faq />}

      {show("contact") && (
        <Contact
          socials={socials}
          email={contactEmail}
          whatsapp={SITE.whatsapp}
          phone={SITE.phone}
        />
      )}

      <Footer socials={socials} />
    </>
  );
}
