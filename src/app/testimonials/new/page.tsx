import { SubmitTestimonialForm } from "@/components/testimonials/SubmitTestimonialForm";

export const metadata = {
  title: "Comparte tu experiencia",
  robots: { index: false },
};

export default function NewTestimonialPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-24">
      <h1 className="mb-2 text-2xl font-semibold">Comparte tu experiencia</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        Si Kodenvia, Noe o Brayam desarrollaron la página web de tu negocio u otro proyecto,
        cuéntanos cómo fue tu experiencia. Indica el nombre del negocio y con quién trabajaste.
        Revisamos las referencias antes de publicarlas.
      </p>
      <SubmitTestimonialForm />
    </section>
  );
}
