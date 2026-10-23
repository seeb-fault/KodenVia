import { SITE } from "@/lib/seo/site";
import { getFaqs } from "@/lib/queries";

export const dynamic = "force-static";

export async function GET() {
  const faqs = await getFaqs();
  const body = `# ${SITE.name}

> ${SITE.description}

## Empresa

- Nombre: ${SITE.name}
- Socios fundadores: ${SITE.founders.join(" y ")}
- Servicios: desarrollo web, aplicaciones a medida y automatización de procesos

## Contacto

${SITE.sameAs.map((u) => `- ${u}`).join("\n")}
- ${SITE.url}
- Correo: ${SITE.email}
- WhatsApp: ${SITE.whatsapp}

## Preguntas frecuentes

${faqs.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}

Más información: ${SITE.url}/llms-full.txt.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
