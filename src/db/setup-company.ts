import { mkdir, writeFile } from "node:fs/promises";
import postgres from "postgres";
import { SITE } from "../lib/seo/site";
import { COMPANY_SOCIAL_LINKS } from "../lib/company-socials";
import { COMPANY_PORTFOLIO, COMPANY_TECHNOLOGIES } from "./company-portfolio";

// Seed a fresh company database without overwriting existing authored content.
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { max: 1 });

try {
  const current = await sql`select name from profile limit 1`;
  if (current.length) {
    console.log("Existing company content preserved. Use the admin to edit it.");
  } else {
    const tables = [
      "profile",
      "services",
      "faqs",
      "taglines",
      "social_links",
      "funding_links",
      "projects",
      "experiences",
      "skills",
    ];
    const backup: Record<string, unknown> = {};
    for (const table of tables) backup[table] = await sql`select * from ${sql(table)}`;
    await mkdir(".local/backups", { recursive: true });
    const backupPath = `.local/backups/company-${Date.now()}.json`;
    await writeFile(backupPath, JSON.stringify(backup, null, 2));

    await sql.begin(async (tx) => {
      const existing = await tx`select id from profile limit 1`;
      const profile = {
        name: SITE.name,
        bio: "Somos Noe Santiago y Brayam Espino, los socios fundadores de Kodenvia. Creamos soluciones digitales para negocios que quieren dar su siguiente paso.\n\nTrabajamos contigo desde la primera idea: entendemos tu necesidad, definimos un alcance claro y desarrollamos una solución que puedas usar y hacer crecer.",
        stats: { years: 0, repos: 0, stars: 0, followers: 0 },
        roles: ["Desarrollo web", "Aplicaciones a medida", "Automatización de procesos"],
        avatar_url: null,
        resume_url: null,
        hero_tagline: SITE.tagline,
        section_visibility: {
          about: true,
          services: true,
          faq: true,
          contact: true,
          skills: true,
          experience: true,
          projects: true,
          testimonials: true,
        },
      };
      if (existing.length) {
        await tx`update profile set ${tx(profile)} where id = ${existing[0].id}`;
      } else {
        await tx`insert into profile ${tx(profile)}`;
      }
      await tx`delete from services`;
      await tx`insert into services ${tx([
        {
          title: "Desarrollo web",
          description:
            "Páginas corporativas, tiendas en línea y plataformas web adaptadas a tu negocio. Diseño que funciona en celulares, navegación clara y una base preparada para crecer.",
          icon: "Globe",
          order: 0,
        },
        {
          title: "Aplicaciones a medida",
          description:
            "Convertimos tu idea en una aplicación útil para tus clientes o tu equipo. Definimos las funciones esenciales y construimos el producto paso a paso contigo.",
          icon: "Code",
          order: 1,
        },
        {
          title: "Automatización de procesos",
          description:
            "Conectamos herramientas y simplificamos tareas repetitivas: registros, notificaciones, reportes e integraciones para que tu equipo dedique más tiempo a lo importante.",
          icon: "Workflow",
          order: 2,
        },
      ])}`;
      await tx`delete from faqs`;
      await tx`insert into faqs ${tx([
        {
          question: "¿Qué tipo de proyectos desarrolla Kodenvia?",
          answer:
            "Creamos páginas web, aplicaciones a medida y automatizaciones de procesos. Empezamos por entender tu negocio para definir qué solución tiene sentido para ti.",
          order: 0,
        },
        {
          question: "¿Cómo empezamos a trabajar juntos?",
          answer:
            "Escríbenos por correo o WhatsApp con tu idea o el problema que quieres resolver. Conversamos sobre tus objetivos y preparamos una propuesta con alcance, etapas y presupuesto.",
          order: 1,
        },
        {
          question: "¿Cuánto cuesta desarrollar un proyecto?",
          answer:
            "Depende de las funciones, las integraciones y el alcance. Te presentamos una cotización antes de comenzar para que puedas decidir con claridad.",
          order: 2,
        },
        {
          question: "¿Pueden mejorar un sistema que ya tengo?",
          answer:
            "Sí. Primero revisamos el estado del sistema y lo que necesitas cambiar. A partir de esa evaluación proponemos mejoras, integraciones o una nueva solución cuando corresponda.",
          order: 3,
        },
        {
          question: "¿Qué sucede después del lanzamiento?",
          answer:
            "Definimos contigo las condiciones de entrega, documentación, soporte y mantenimiento. Estas condiciones quedan detalladas en la propuesta de tu proyecto.",
          order: 4,
        },
      ])}`;
      await tx`delete from taglines`;
      await tx`insert into taglines (text, active, "order") values (${SITE.tagline}, true, 0)`;
      await tx`delete from social_links`;
      for (const link of COMPANY_SOCIAL_LINKS) {
        await tx`insert into social_links ${tx(link)}`;
      }
      await tx`delete from funding_links`;
      for (const [order, project] of COMPANY_PORTFOLIO.entries()) {
        await tx`insert into projects (repo, title, custom_blurb, tags, details, featured, hidden, "order") values (${project.repo}, ${project.title}, ${project.description}, ${tx.json(project.tags)}, ${tx.json(project.details as postgres.JSONValue)}, ${project.featured}, false, ${order})`;
        await tx`insert into experiences (contributor, role, org, period, is_current, description, "order") values (${project.details.contributor!}, ${project.details.role!}, ${project.title}, ${project.details.period!}, ${project.details.period!.includes("actualidad")}, ${tx.json([project.details.context!, ...project.details.highlights!.slice(0, 3)])}, ${order})`;
      }
      await tx`delete from skills`;
      for (const [order, technology] of COMPANY_TECHNOLOGIES.entries()) {
        await tx`insert into skills (name, icon_path, category, "order") values (${technology.name}, ${technology.iconPath}, ${technology.category}, ${order})`;
      }
    });
    console.log(`Company content updated. Previous content saved to ${backupPath}`);
  }
} finally {
  await sql.end();
}
