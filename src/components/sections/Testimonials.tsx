import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SubmitTestimonialModal } from "@/components/testimonials/SubmitTestimonialModal";
import { TestimonialsMarquee } from "./TestimonialsMarquee";
import { DEMO_REFERENCES } from "@/lib/demo-references";

export type TestimonialCard = {
  id: string;
  name: string;
  relationship: string;
  content: string;
  imageUrl: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  demoNotice?: string;
  attribution?: string;
};

const demoItems: TestimonialCard[] = DEMO_REFERENCES.map((reference, index) => ({
  id: `demo-reference-${index}`,
  name: reference.name,
  relationship: reference.sector,
  content: reference.content,
  imageUrl: null,
  demoNotice: reference.notice,
  attribution: reference.author,
}));

export function Testimonials({ items }: { items: TestimonialCard[] }) {
  const isDemo = items.length === 0;

  return (
    <Section id="testimonials" className="scroll-mt-24">
      <Reveal>
        <SectionHeading number="07" eyebrow="Testimonios" title="Lo que dicen de nuestro trabajo" />
      </Reveal>

      {isDemo && (
        <Reveal delay={0.05}>
          <p className="text-muted mb-6 max-w-2xl text-sm leading-relaxed">
            <span className="text-foreground font-medium">Contenido de demostración.</span> Estos
            ejemplos son ilustrativos y no acreditan clientes ni trabajos terminados. Se
            reemplazarán por referencias reales revisadas y autorizadas.
          </p>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <TestimonialsMarquee items={isDemo ? demoItems : items} />
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex justify-center">
          <SubmitTestimonialModal>
            <Button variant="primary" size="md">
              Dejar una referencia
            </Button>
          </SubmitTestimonialModal>
        </div>
      </Reveal>
    </Section>
  );
}
