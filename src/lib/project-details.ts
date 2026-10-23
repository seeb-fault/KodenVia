export const PROJECT_STATUS_LABELS = {
  development: "En desarrollo",
  prototype: "Prototipo funcional local",
  research: "Propuesta académica",
  released: "Publicado",
} as const;

export type ProjectDetails = {
  contributor?: string | null;
  role?: string | null;
  period?: string | null;
  status?: keyof typeof PROJECT_STATUS_LABELS;
  context?: string | null;
  projectUrl?: string | null;
  repositoryUrl?: string | null;
  highlights?: string[];
};

export function getRepositorySlug(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") return null;
    const path = parsed.pathname.replace(/^\//, "").replace(/\/$/, "");
    return /^[\w.-]+\/[\w.-]+$/.test(path) ? path.replace(/\.git$/, "") : null;
  } catch {
    return null;
  }
}

export function getProjectLinks(project: {
  details?: ProjectDetails | null;
  htmlUrl?: string | null;
  homepage?: string | null;
}) {
  return {
    repository: project.details?.repositoryUrl || project.htmlUrl || null,
    website: project.details?.projectUrl || project.homepage || null,
  };
}
