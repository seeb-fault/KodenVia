import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { TEAM_MEMBERS } from "@/lib/team";
import type { ExperienceRow } from "@/lib/queries";

export function Experience({ experiences }: { experiences: ExperienceRow[] }) {
  return (
    <Section id="experience" className="scroll-mt-24">
      <Reveal>
        <SectionHeading
          number="06"
          eyebrow="Experiencia"
          title="La trayectoria detrás de Kodenvia"
        />
        <p className="text-muted -mt-6 mb-10 max-w-2xl text-sm leading-relaxed">
          Experiencia individual y participación en proyectos independientes, institucionales y
          académicos. Cada entrada identifica al socio responsable y el trabajo que realizó.
        </p>
      </Reveal>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {TEAM_MEMBERS.map((member) => {
          const entries = experiences
            .filter((entry) => entry.contributor === member.name)
            .sort((a, b) => a.order - b.order);
          return (
            <Reveal key={member.name}>
              <article className="border-border bg-surface rounded-3xl border p-6 sm:p-8">
                <h3 className="mb-7 text-2xl font-semibold">{member.name}</h3>
                {entries.length === 0 ? (
                  <p className="text-muted text-sm">Trayectoria por incorporar.</p>
                ) : (
                  <ol className="border-border space-y-8 border-l pl-6">
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <p className="text-muted font-mono text-xs">{entry.period}</p>
                        <h4 className="mt-2 text-lg font-semibold">{entry.role}</h4>
                        <p className="mt-1 text-sm text-(--accent-on-chip)">{entry.org}</p>
                        {entry.location && (
                          <p className="text-muted mt-1 text-xs">{entry.location}</p>
                        )}
                        <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
                          {entry.description.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export default Experience;
