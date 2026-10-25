import { db } from "@/db/client";
import { services } from "@/db/schema";
import { createService, updateService, deleteService } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  { name: "title", label: "Nombre", type: "text", placeholder: "Desarrollo web", required: true },
  {
    name: "description",
    label: "Descripción completa",
    type: "textarea",
    rows: 3,
    placeholder: "Describe el servicio y su alcance",
    required: true,
  },
  {
    name: "shortDescription",
    label: "Descripción breve",
    type: "text",
    placeholder: "Resumen en una línea",
    hint: "Opcional. Se muestra en la tarjeta.",
  },
  {
    name: "icon",
    label: "Ruta del icono",
    type: "text",
    placeholder: "/icons/web.svg",
    hint: "Opcional",
  },
  { name: "order", label: "Orden", type: "number" },
];

function parse(formData: FormData) {
  return {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    shortDescription: (formData.get("shortDescription") as string) || null,
    icon: (formData.get("icon") as string) || null,
    order: Number(formData.get("order") || 0),
  };
}

export default async function ServicesEditor() {
  const rows = await db.select().from(services).orderBy(services.order);

  async function create(formData: FormData) {
    "use server";
    await createService(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateService(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteService(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Servicios"
      description="Servicios que ofrece Kodenvia."
      createTitle="Añadir servicio"
      editTitle="Editar servicio"
      fields={fields}
      rows={rows}
      toRow={(s) => ({
        primary: s.title,
        meta: s.shortDescription ?? undefined,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay servicios."
    />
  );
}
