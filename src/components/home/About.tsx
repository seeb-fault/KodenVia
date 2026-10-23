import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { TEAM_MEMBERS } from "@/lib/team";

export type AboutProfile = {
  bio: string;
  stats: { years: number; repos: number; stars: number; followers: number };
  name?: string;
  avatarUrl?: string;
};

export function About({ profile }: { profile: AboutProfile }) {
  return (
    <Section id="about" className="scroll-mt-24">
      <Reveal>
        <SectionHeading
          number="02"
          eyebrow="Nuestro equipo"
          title="Dos socios. Una misma visión."
        />
      </Reveal>
      <div className="grid gap-10">
        <Reveal delay={0.08}>
          <div className="space-y-5">
            {profile.bio
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "text-foreground text-xl leading-relaxed font-medium sm:text-2xl"
                      : "text-muted text-base leading-relaxed sm:text-lg"
                  }
                >
                  {paragraph}
                </p>
              ))}
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEAM_MEMBERS.map(({ name, specialty, summary, education }, index) => (
            <Reveal key={name} delay={0.12 + index * 0.08} className="h-full">
              <Card className="flex h-full flex-col justify-between gap-8 p-6">
                <span aria-hidden className="gradient-text font-mono text-4xl font-bold">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="text-muted mt-2 text-sm">Socio fundador</p>
                  {specialty && (
                    <p className="text-foreground mt-4 text-sm font-medium">{specialty}</p>
                  )}
                  {summary && <p className="text-muted mt-3 text-sm leading-relaxed">{summary}</p>}
                  {education && (
                    <p className="text-muted mt-3 text-xs leading-relaxed">{education}</p>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default About;
