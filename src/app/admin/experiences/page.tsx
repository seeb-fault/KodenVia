import { db } from "@/db/client";
import { experienceInsertSchema } from "@/lib/schemas";
import { experiences } from "@/db/schema";
import { createExperience, updateExperience, deleteExperience } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Badge } from "@/components/admin/ui";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  {
    name: "contributor",
    label: "Socio",
    type: "select",
    options: [
      { value: "", label: "Seleccionar socio" },
      { value: "Noe Santiago", label: "Noe Santiago" },
      { value: "Brayam Espino", label: "Brayam Espino" },
    ],
    hint: "Las entradas sin socio asignado no se publican.",
  },

  {
    name: "role",
    label: "Rol o participación",
    type: "text",
    placeholder: "Software Engineer",
    required: true,
  },
  {
    name: "org",
    label: "Proyecto u organización",
    type: "text",
    placeholder: "Nombre del proyecto u organización",
    required: true,
  },
  {
    name: "period",
    label: "Periodo",
    type: "text",
    placeholder: "2026 - actualidad",
    required: true,
  },
  {
    name: "location",
    label: "Ubicación",
    type: "text",
    placeholder: "Ayacucho, Perú",
    hint: "Opcional",
  },
  {
    name: "description",
    label: "Responsabilidades y contexto",
    type: "textarea",
    rows: 4,
    hint: "Una contribución por línea. Indica si fue un proyecto personal, académico o un empleo.",
  },
  { name: "order", label: "Orden", type: "number" },
  { name: "isCurrent", label: "Actividad actual", type: "checkbox" },
];

function parse(formData: FormData) {
  return experienceInsertSchema.parse({
    contributor: String(formData.get("contributor") || "") || null,
    role: String(formData.get("role")),
    org: String(formData.get("org")),
    period: String(formData.get("period")),
    location: (formData.get("location") as string) || null,
    isCurrent: formData.get("isCurrent") === "on",
    description: String(formData.get("description") || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    order: Number(formData.get("order") || 0),
  });
}

export default async function ExperiencesEditor() {
  const rows = await db.select().from(experiences).orderBy(experiences.order);

  async function create(formData: FormData) {
    "use server";
    await createExperience(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateExperience(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteExperience(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Experiencia del equipo"
      description="Trayectoria individual de cada socio, con su contexto y contribución."
      createTitle="Añadir experiencia"
      editTitle="Editar experiencia"
      fields={fields}
      rows={rows}
      toRow={(e) => ({
        primary: `${e.role} @ ${e.org}`,
        meta: [e.contributor, e.period].filter(Boolean).join(" · "),
        badges: e.isCurrent ? <Badge tone="success">Actual</Badge> : null,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay experiencias."
    />
  );
}
