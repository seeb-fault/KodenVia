import { db } from "@/db/client";
import { profile } from "@/db/schema";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SectionVisibilityToggles } from "@/components/admin/SectionVisibilityToggles";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [row] = await db
    .select({ sectionVisibility: profile.sectionVisibility })
    .from(profile)
    .limit(1);
  const sectionVisibility = (row?.sectionVisibility ?? {}) as Record<string, boolean>;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Configuración"
        description="Elige qué se muestra en el sitio público de Kodenvia."
      />

      <section className="border-border bg-surface rounded-2xl border p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-foreground font-semibold">Secciones de la página principal</h2>
          <p className="text-muted mt-0.5 text-sm">
            Activa o desactiva cada sección. Los cambios se guardan al instante. Las secciones
            ocultas tampoco aparecen en el menú del sitio.
          </p>
        </div>
        <SectionVisibilityToggles visibility={sectionVisibility} />
      </section>
    </div>
  );
}
