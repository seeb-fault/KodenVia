import { SITE } from "@/lib/seo/site";
import {
  getProfile,
  getServices,
  getFaqs,
  getProjectsMerged,
  getExperiences,
  getSkills,
} from "@/lib/queries";
import { PROJECT_STATUS_LABELS, getProjectLinks } from "@/lib/project-details";
import { TEAM_MEMBERS } from "@/lib/team";

export const dynamic = "force-static";

function section(heading: string, content: string): string {
  return content ? `## ${heading}\n\n${content}\n\n` : "";
}

export async function GET() {
  const profile = await getProfile();
  const show = (id: string) => profile.sectionVisibility[id] !== false;
  const [services, faqs, projects, experiences, skills] = await Promise.all([
    show("services") ? getServices() : Promise.resolve([]),
    show("faq") ? getFaqs() : Promise.resolve([]),
    show("projects") ? getProjectsMerged() : Promise.resolve([]),
    show("experience") ? getExperiences() : Promise.resolve([]),
    show("skills") ? getSkills() : Promise.resolve([]),
  ]);
  const serviceText = services
    .map((service) => `### ${service.title}\n${service.description}`)
    .join("\n\n");
  const faqText = faqs.map((faq) => `### ${faq.question}\n${faq.answer}`).join("\n\n");
  const teamText = TEAM_MEMBERS.map(
    (member) =>
      `### ${member.name}\nSocio fundador. ${member.specialty ?? ""}\n${member.summary ?? ""}\n${member.education ?? ""}`,
  ).join("\n\n");
  const projectText = projects
    .map((project) => {
      const details = project.details;
      const links = getProjectLinks(project);
      return `### ${project.title}\nResponsable: ${details.contributor ?? ""}\nRol: ${details.role ?? ""}\nPeriodo: ${details.period ?? ""}\nEstado: ${details.status ? PROJECT_STATUS_LABELS[details.status] : ""}\nContexto: ${details.context ?? ""}\n${project.description ?? ""}\nTecnologías: ${project.tags.join(", ")}\n${(details.highlights ?? []).map((point) => `- ${point}`).join("\n")}${links.repository ? `\nRepositorio: ${links.repository}` : ""}${links.website ? `\nSitio: ${links.website}` : ""}`;
    })
    .join("\n\n");
  const experienceText = experiences
    .map(
      (entry) =>
        `### ${entry.contributor}: ${entry.role}\n${entry.org} · ${entry.period}\n${entry.description.map((point) => `- ${point}`).join("\n")}`,
    )
    .join("\n\n");
  const skillText = skills.map((skill) => `- ${skill.name} (${skill.category})`).join("\n");
  const body = `# ${SITE.name}

> ${SITE.description}

## Empresa

- Nombre: ${profile.name}
- Socios fundadores: ${SITE.founders.join(" y ")}
- Especialidades: ${profile.roles.join(" · ")}

${show("about") ? section("Nosotros", `${profile.bio}\n\n${teamText}`) : ""}${section("Servicios", serviceText)}${section("Tecnologías", skillText)}${section("Proyectos del equipo", projectText)}${section("Experiencia individual", experienceText)}${section("Preguntas frecuentes", faqText)}${show("contact") ? section("Contacto", `- Sitio: ${SITE.url}\n- Correo: ${SITE.email}\n- WhatsApp: ${SITE.whatsapp}`) : ""}`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
