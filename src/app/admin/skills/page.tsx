import { db } from "@/db/client";
import { skills } from "@/db/schema";
import { createSkill, updateSkill, deleteSkill } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { Badge } from "@/components/admin/ui";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const levelLabels: Record<string, string> = {
  Expert: "Experto",
  Intermediate: "Intermedio",
  Beginner: "Principiante",
};

const fields: AdminField[] = [
  {
    name: "name",
    label: "Nombre de la tecnología",
    type: "text",
    placeholder: "React.js",
    required: true,
  },
  {
    name: "category",
    label: "Categoría",
    type: "text",
    placeholder: "Desarrollo de interfaces",
    required: true,
  },
  {
    name: "iconPath",
    label: "Icono",
    type: "image",
    folder: "skills",
    placeholder: "https://… o sube un icono SVG/PNG",
    hint: "Sube un icono o pega un enlace. Puedes conservar las rutas de los iconos existentes.",
  },
  {
    name: "level",
    label: "Nivel",
    type: "select",
    options: [
      { value: "", label: "Sin nivel" },
      { value: "Expert", label: "Experto" },
      { value: "Intermediate", label: "Intermedio" },
      { value: "Beginner", label: "Principiante" },
    ],
  },
  { name: "order", label: "Orden", type: "number" },
];

function parse(formData: FormData) {
  const raw = formData.get("level") as string;
  const level: "Expert" | "Intermediate" | "Beginner" | null =
    raw === "Expert" || raw === "Intermediate" || raw === "Beginner" ? raw : null;
  return {
    name: String(formData.get("name")),
    iconPath: String(formData.get("iconPath")),
    category: String(formData.get("category")),
    level,
    order: Number(formData.get("order") || 0),
  };
}

export default async function SkillsEditor() {
  const rows = await db.select().from(skills).orderBy(skills.order);

  async function create(formData: FormData) {
    "use server";
    await createSkill(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateSkill(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteSkill(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Tecnologías"
      description="Herramientas y tecnologías organizadas por categoría."
      createTitle="Añadir tecnología"
      editTitle="Editar tecnología"
      fields={fields}
      rows={rows}
      toRow={(s) => ({
        primary: s.name,
        meta: s.category,
        badges: s.level ? <Badge>{levelLabels[s.level] ?? s.level}</Badge> : null,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay tecnologías."
    />
  );
}
