import { db } from "@/db/client";
import { taglines } from "@/db/schema";
import { createTagline, updateTagline, deleteTagline } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { type AdminField } from "@/components/admin/RecordFormDialog";
import { Badge } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  {
    name: "text",
    label: "Lema",
    type: "text",
    placeholder: "Tecnología que impulsa tu negocio",
    required: true,
  },
  { name: "order", label: "Orden", type: "number" },
  { name: "active", label: "Activo (disponible para mostrarse)", type: "checkbox" },
];

function parse(formData: FormData) {
  return {
    text: String(formData.get("text")),
    order: Number(formData.get("order") || 0),
    active: formData.get("active") === "on",
  };
}

export default async function TaglinesEditor() {
  const rows = await db.select().from(taglines).orderBy(taglines.order);

  async function create(formData: FormData) {
    "use server";
    await createTagline(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateTagline(String(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteTagline(String(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Lemas"
      description="Frases de la presentación principal. Se elige una al regenerar la página; solo se muestran las activas."
      createTitle="Añadir lema"
      editTitle="Editar lema"
      fields={fields}
      rows={rows}
      toRow={(t) => ({
        primary: t.text,
        badges: t.active ? null : <Badge tone="warning">Inactivo</Badge>,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay lemas."
    />
  );
}
