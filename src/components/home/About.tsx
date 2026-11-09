import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";

import { TeamShowcase } from "@/components/home/TeamShowcase";

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
        <TeamShowcase />
      </div>
    </Section>
  );
}

export default About;
