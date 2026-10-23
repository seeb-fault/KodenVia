import { PROJECT_STATUS_LABELS, type ProjectDetails } from "@/lib/project-details";

export function ProjectFacts({ details }: { details?: ProjectDetails | null }) {
  if (!details) return null;
  return (
    <div className="my-4 space-y-3">
      <div className="flex flex-wrap gap-2 text-xs">
        {details.contributor && (
          <span className="text-foreground font-semibold">{details.contributor}</span>
        )}
        {details.status && (
          <span className="rounded-full border border-(--brand-deep)/40 bg-(--chip-surface) px-2 py-0.5 text-(--accent-on-chip)">
            {PROJECT_STATUS_LABELS[details.status]}
          </span>
        )}
      </div>
      <dl className="text-muted space-y-1 text-xs leading-relaxed">
        {details.role && (
          <div>
            <dt className="text-foreground inline font-medium">Rol: </dt>
            <dd className="inline">{details.role}</dd>
          </div>
        )}
        {details.period && (
          <div>
            <dt className="text-foreground inline font-medium">Periodo: </dt>
            <dd className="inline">{details.period}</dd>
          </div>
        )}
        {details.context && (
          <div>
            <dt className="text-foreground inline font-medium">Contexto: </dt>
            <dd className="inline">{details.context}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
