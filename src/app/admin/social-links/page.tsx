import { db } from "@/db/client";
import { socialLinks } from "@/db/schema";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "../actions";
import { AdminCrudPage } from "@/components/admin/AdminCrudPage";
import { type AdminField } from "@/components/admin/RecordFormDialog";

export const dynamic = "force-dynamic";

const fields: AdminField[] = [
  { name: "platform", label: "Plataforma", type: "text", placeholder: "GitHub", required: true },
  {
    name: "username",
    label: "Nombre de usuario",
    type: "text",
    placeholder: "santiago-noe",
    hint: "Opcional",
  },
  {
    name: "url",
    label: "Enlace",
    type: "url",
    placeholder: "https://github.com/santiago-noe",
    required: true,
  },
  { name: "order", label: "Orden", type: "number" },
];

function parse(formData: FormData) {
  return {
    platform: String(formData.get("platform")),
    url: String(formData.get("url")),
    username: (formData.get("username") as string) || null,
    order: Number(formData.get("order") || 0),
  };
}

export default async function SocialLinksEditor() {
  const rows = await db.select().from(socialLinks).orderBy(socialLinks.order);

  async function create(formData: FormData) {
    "use server";
    await createSocialLink(parse(formData));
  }
  async function update(formData: FormData) {
    "use server";
    await updateSocialLink(Number(formData.get("id")), parse(formData));
  }
  async function remove(formData: FormData) {
    "use server";
    await deleteSocialLink(Number(formData.get("id")));
  }

  return (
    <AdminCrudPage
      title="Redes y contacto"
      description="Enlaces y canales de contacto de la empresa."
      createTitle="Añadir enlace"
      editTitle="Editar enlace"
      fields={fields}
      rows={rows}
      toRow={(l) => ({
        primary: l.platform,
        meta: l.username ? `@${l.username} · ${l.url}` : l.url,
      })}
      createAction={create}
      updateAction={update}
      deleteAction={remove}
      empty="Todavía no hay enlaces."
    />
  );
}
