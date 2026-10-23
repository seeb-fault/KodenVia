import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProjectsBrowser } from "./ProjectsBrowser";
import type { MergedProject } from "@/lib/projects";
import { COMPANY_SOCIAL_LINKS } from "@/lib/company-socials";

const GITHUB_PROFILE = COMPANY_SOCIAL_LINKS.find((link) => link.platform === "github")!.url;

/** Server shell: heading and CTA stay server-rendered, and ProjectsBrowser owns the
 *  parts that need selection state (showcase, filter, grid, quick view). */
export function Projects({ projects }: { projects: MergedProject[] }) {
  return (
    <Section id="projects" className="scroll-mt-24">
      <Reveal>
        <SectionHeading number="05" eyebrow="Proyectos" title="Trabajo que aporta nuestro equipo" />
        <p className="text-muted -mt-6 mb-8 max-w-2xl text-sm leading-relaxed">
          Proyectos individuales y académicos, con la participación y el estado de cada trabajo.
          Esta selección incluye experiencia previa y proyectos en curso.
        </p>
      </Reveal>

      <ProjectsBrowser projects={projects} />

      <div className="mt-12 text-center">
        <Magnetic>
          <Button
            href={GITHUB_PROFILE}
            variant="secondary"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<ArrowUpRight className="size-4" aria-hidden />}
          >
            GitHub de Noe Santiago
          </Button>
        </Magnetic>
      </div>
    </Section>
  );
}

export default Projects;
