import { db } from "@/db/client";
import { projectInsertSchema } from "@/lib/schemas";
import { projects } from "@/db/schema";
import { createProject, updateProject, deleteProject } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Badge } from "@/components/admin/ui";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  {
    name: "contributor",
    label: "Responsable del proyecto",
    type: "select",
    options: [
      { value: "", label: "Seleccionar responsable" },
      { value: "Noe Santiago", label: "Noe Santiago" },
      { value: "Brayam Espino", label: "Brayam Espino" },
      { value: "Kodenvia", label: "Kodenvia" },
    ],
    hint: "Los proyectos sin responsable no se publican.",
  },
  { name: "role", label: "Rol y participación", type: "text" },
  { name: "period", label: "Periodo", type: "text", placeholder: "2025 - 2026" },
  {
    name: "context",
    label: "Contexto",
    type: "text",
    placeholder: "Proyecto independiente, institucional o académico",
  },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "development", label: "En desarrollo" },
      { value: "prototype", label: "Prototipo funcional local" },
      { value: "research", label: "Propuesta académica" },
      { value: "released", label: "Publicado" },
    ],
  },
  {
    name: "projectUrl",
    label: "Sitio o demostración pública",
    type: "url",
    hint: "Opcional. Dejar vacío si todavía no hay un enlace confirmado.",
  },
  {
    name: "repositoryUrl",
    label: "Repositorio público",
    type: "url",
    placeholder: "https://github.com/usuario/repositorio",
    hint: "Opcional. Solo repositorios confirmados de GitHub.",
  },
  {
    name: "highlights",
    label: "Contribuciones y alcance",
    type: "textarea",
    rows: 5,
    hint: "Una contribución por línea. Diferencia lo implementado de lo planificado.",
  },

  {
    name: "repo",
    label: "Identificador",
    type: "text",
    placeholder: "noe-nombre-proyecto",
    required: true,
  },
  {
    name: "title",
    label: "Nombre del proyecto",
    type: "text",
    placeholder: "Nombre del proyecto",
    required: true,
  },
  {
    name: "customBlurb",
    label: "Descripción",
    type: "textarea",
    rows: 2,
    hint: "Describe el alcance real del proyecto.",
  },
  {
    name: "tags",
    label: "Tecnologías",
    type: "text",
    placeholder: "Flutter, Dart",
    hint: "Separadas por comas",
  },
  {
    name: "coverImage",
    label: "Imagen de portada",
    type: "image",
    folder: "projects",
    hint: "Se muestra en los proyectos destacados y en su vista de detalle. Si no hay imagen, se usa el degradado de la marca. Sube un archivo o usa un enlace de imagen permitido por el sitio.",
  },
  {
    name: "screenshots",
    label: "Capturas",
    type: "images",
    max: 6,
    hint: "Se muestran en este orden en la galería del proyecto. Sube archivos o usa enlaces de imágenes permitidos por el sitio.",
  },
  {
    name: "order",
    label: "Orden",
    type: "number",
    hint: "Los números menores aparecen primero. Los primeros proyectos destacados se muestran en formato grande.",
  },
  { name: "featured", label: "Destacado", type: "checkbox" },
  { name: "hidden", label: "Oculto", type: "checkbox" },
];

/** Parse the screenshots hidden input, which MultiImageUploadField submits as JSON. */
function parseScreenshots(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || value.trim() === "") return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    // A malformed value must not wipe the rest of the record on save.
    return [];
  }
}

function parse(formData: FormData) {
  return projectInsertSchema.parse({
    details: {
      contributor: String(formData.get("contributor") || "") || null,
      role: String(formData.get("role") || "") || null,
      period: String(formData.get("period") || "") || null,
      context: String(formData.get("context") || "") || null,
      status: String(formData.get("status") || "development"),
      projectUrl: String(formData.get("projectUrl") || "") || null,
      repositoryUrl: String(formData.get("repositoryUrl") || "") || null,
      highlights: String(formData.get("highlights") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    },
    repo: String(formData.get("repo")),
    title: String(formData.get("title")),
    customBlurb: (formData.get("customBlurb") as string) || null,
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") || 0),
    hidden: formData.get("hidden") === "on",
    coverImage: (formData.get("coverImage") as string) || null,
    screenshots: parseScreenshots(formData.get("screenshots")),
  });
}

export default async function ProjectsEditor() {
  const rows = (await db.select().from(projects).orderBy(projects.order)).map((row) => ({
    ...row,
    ...row.details,
    highlights: row.details.highlights ?? [],
  }));

  async function create(formData: FormData) {
    "use server";
    await createProject(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateProject(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteProject(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Proyectos"
      description="Proyectos del equipo, con autoría, rol, periodo y estado real."
      createTitle="Añadir proyecto"
      editTitle="Editar proyecto"
      fields={fields}
      rows={rows}
      toRow={(p) => ({
        primary: p.title,
        meta: [p.contributor, p.period, p.repo].filter(Boolean).join(" · "),
        badges: (
          <>
            {p.featured ? <Badge tone="brand">Destacado</Badge> : null}
            {p.hidden ? <Badge tone="warning">Oculto</Badge> : null}
          </>
        ),
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay proyectos."
    />
  );
}
