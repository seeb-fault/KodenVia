import { db } from "@/db/client";
import { profile } from "@/db/schema";
import { updateProfile } from "../actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Panel, Field, Input, Textarea, SubmitButton } from "@/components/admin/ui";
import { AvatarField } from "@/components/admin/AvatarField";

export const dynamic = "force-dynamic";

export default async function ProfileEditor() {
  // Profile is a singleton — read the first row (its serial id can drift after
  // a reseed, so don't filter by a hardcoded id).
  const [row] = await db.select().from(profile).limit(1);

  async function action(formData: FormData) {
    "use server";
    // Roles feed the hero marquee. Accept comma- or newline-separated input,
    // trim, and drop blanks.
    const roles = String(formData.get("roles") ?? "")
      .split(/[\n,]/)
      .map((r) => r.trim())
      .filter(Boolean);
    // avatarUrl is deliberately absent: AvatarField owns that column and writes it on upload.
    // Zod drops the absent optional, so Drizzle leaves the column alone rather than nulling it.
    await updateProfile({
      name: String(formData.get("name")),
      bio: String(formData.get("bio")),
      stats: row?.stats ?? {},
      roles,
      // Visibility is managed on the dashboard; preserve it unchanged on save.
      sectionVisibility: row?.sectionVisibility ?? {},
      resumeUrl: (formData.get("resumeUrl") as string) || null,
      heroTagline: (formData.get("heroTagline") as string) || null,
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Empresa"
        description="Nombre, presentación, especialidades y enlaces de Kodenvia."
      />

      <Panel>
        <form action={action} className="flex flex-col gap-4">
          <AvatarField defaultValue={row?.avatarUrl ?? ""} />

          <Field label="Nombre">
            <Input name="name" defaultValue={row?.name} placeholder="Nombre de la empresa" />
          </Field>
          <Field label="Presentación">
            <Textarea
              name="bio"
              defaultValue={row?.bio}
              rows={4}
              placeholder="Describe la empresa y su propuesta de valor"
            />
          </Field>
          <Field
            label="Especialidades"
            hint="Se muestran en la presentación principal. Escribe una por línea o sepáralas por comas."
          >
            <Textarea
              name="roles"
              defaultValue={(row?.roles ?? []).join("\n")}
              rows={3}
              placeholder={"Desarrollo web\nAplicaciones a medida\nAutomatización de procesos"}
            />
          </Field>
          <Field
            label="Enlace al documento de presentación"
            hint="URL HTTPS completa al documento o currículum que quieras compartir."
          >
            <Input name="resumeUrl" defaultValue={row?.resumeUrl ?? ""} placeholder="https://…" />
          </Field>
          <Field
            label="Lema de la presentación"
            hint="Frase breve sobre el nombre de la empresa. Déjala vacía para ocultarla."
          >
            <Input
              name="heroTagline"
              defaultValue={row?.heroTagline ?? ""}
              placeholder="Tecnología que impulsa tu negocio"
            />
          </Field>
          <SubmitButton>Guardar cambios</SubmitButton>
        </form>
      </Panel>
    </div>
  );
}
