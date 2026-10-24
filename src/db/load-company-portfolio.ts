import { mkdir, writeFile } from "node:fs/promises";
import postgres from "postgres";
import { COMPANY_PORTFOLIO, COMPANY_TECHNOLOGIES } from "./company-portfolio";

// Explicit local content import. Regular db:seed never overwrites authored content.
const url = process.env.DATABASE_URL;
if (!url || !["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname)) {
  throw new Error("Portfolio import requires a local DATABASE_URL");
}
const sql = postgres(url, { max: 1 });
try {
  const backup: Record<string, unknown> = {};
  for (const table of ["projects", "experiences", "skills", "profile"]) {
    backup[table] = await sql`select * from ${sql(table)}`;
  }
  await mkdir(".local/backups", { recursive: true });
  await writeFile(`.local/backups/portfolio-${Date.now()}.json`, JSON.stringify(backup, null, 2));
  await sql.begin(async (tx) => {
    await tx`update projects set hidden = true where details->>'contributor' is null`;
    for (const [order, project] of COMPANY_PORTFOLIO.entries()) {
      const values = {
        repo: project.repo,
        title: project.title,
        custom_blurb: project.description,
        tags: tx.json(project.tags),
        details: tx.json(project.details as postgres.JSONValue),
        featured: project.featured,
        hidden: false,
        order,
      };
      const existing = await tx`select id from projects where repo = ${project.repo}`;
      if (existing.length) await tx`update projects set ${tx(values)} where id = ${existing[0].id}`;
      else await tx`insert into projects ${tx(values)}`;
      const experience = {
        contributor: project.details.contributor!,
        role: project.details.role!,
        org: project.title,
        period: project.details.period!,
        location: null,
        is_current: project.details.period!.includes("actualidad"),
        description: tx.json([
          project.details.context!,
          ...project.details.highlights!.slice(0, 3),
        ]),
        order,
      };
      const previous =
        await tx`select id from experiences where contributor = ${experience.contributor} and org = ${experience.org}`;
      if (previous.length)
        await tx`update experiences set ${tx(experience)} where id = ${previous[0].id}`;
      else await tx`insert into experiences ${tx(experience)}`;
    }
    await tx`delete from skills`;
    for (const [order, technology] of COMPANY_TECHNOLOGIES.entries()) {
      await tx`insert into skills (name, icon_path, category, level, "order") values (${technology.name}, ${technology.iconPath}, ${technology.category}, null, ${order})`;
    }
    await tx`update profile set section_visibility = section_visibility || '{"projects":true,"experience":true,"skills":true}'::jsonb`;
  });
  const count = COMPANY_PORTFOLIO.length;
  console.log(
    `Imported ${count} attributed projects, ${count} project experience entries and the provided technologies.`,
  );
} finally {
  await sql.end();
}
