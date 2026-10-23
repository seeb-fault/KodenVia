import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/db/schema";

const state = vi.hoisted(() => ({ rows: [] as unknown[], cache: vi.fn() }));
vi.mock("@/db/client", () => ({
  db: { select: () => ({ from: async () => state.rows }) },
}));
vi.mock("@/lib/github-cache", () => ({ getCachedRepoData: state.cache }));
import { getProjects } from "./projects";

function project(repo: string, details: Project["details"]): Project {
  return {
    id: 1,
    repo,
    details,
    title: repo,
    customBlurb: "Trabajo individual.",
    tags: [],
    featured: false,
    order: 0,
    hidden: false,
    coverImage: null,
    screenshots: [],
  };
}

beforeEach(() => {
  state.cache.mockReset().mockResolvedValue(new Map());
});

describe("company project loader", () => {
  it("does not fetch template repositories or invent links for unconfirmed work", async () => {
    state.rows = [
      project("noe-qatu", { contributor: "Noe Santiago", status: "development" }),
      project("old-template-project", {}),
    ];
    const rows = await getProjects();
    expect(state.cache).toHaveBeenCalledWith([]);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      repo: "noe-qatu",
      htmlUrl: null,
      homepage: null,
      stars: null,
      forks: null,
    });
  });

  it("uses each member's confirmed repository URL and retains authorship when the cache is empty", async () => {
    state.rows = [
      project("noe-project", {
        contributor: "Noe Santiago",
        repositoryUrl: "https://github.com/santiago-noe/project",
      }),
      project("brayam-project", {
        contributor: "Brayam Espino",
        repositoryUrl: "https://github.com/example-member/project",
      }),
    ];
    const rows = await getProjects();
    expect(state.cache).toHaveBeenCalledWith(["santiago-noe/project", "example-member/project"]);
    expect(rows[0].htmlUrl).toBe("https://github.com/santiago-noe/project");
    expect(rows[1].details.contributor).toBe("Brayam Espino");
    expect(rows[1].stars).toBeNull();
  });
});
