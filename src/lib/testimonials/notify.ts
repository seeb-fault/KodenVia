import { Resend } from "resend";
import { requireEnv } from "@/lib/env";
import { BRAND } from "@/lib/brand";

type NotifyInput = {
  id: string;
  name: string;
  relationship: string;
  content: string;
  imageUrl: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildTestimonialEmail(
  input: NotifyInput,
  siteUrl: string,
): {
  subject: string;
  html: string;
} {
  const approveUrl = `${siteUrl}/admin/testimonials?focus=${input.id}`;
  return {
    subject: `Nuevo testimonio de ${input.name} (pendiente)`,
    html: `
      <h2>Nuevo testimonio pendiente de revisión</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Relación con Kodenvia:</strong> ${escapeHtml(input.relationship)}</p>
      <blockquote style="border-left:3px solid ${BRAND.deep};padding-left:12px;color:#444">
        ${escapeHtml(input.content)}
      </blockquote>
      ${input.imageUrl ? `<p><img src="${escapeHtml(input.imageUrl)}" alt="Imagen de perfil" width="64" height="64" style="border-radius:50%"/></p>` : "<p><em>No se adjuntó una imagen.</em></p>"}
      <p><a href="${approveUrl}" style="background:${BRAND.mid};color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Revisar en el administrador</a></p>
    `,
  };
}

export async function notifyNewTestimonial(input: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.warn("Resend not configured; skipping testimonial notification");
    return;
  }
  // From-address and site URL are env-driven with no fallback; resolved here
  // (not at module load) so importing this module never requires them.
  const from = requireEnv("RESEND_FROM_EMAIL");
  const siteUrl = requireEnv("NEXT_PUBLIC_SITE_URL");
  const resend = new Resend(apiKey);
  const { subject, html } = buildTestimonialEmail(input, siteUrl);
  await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
