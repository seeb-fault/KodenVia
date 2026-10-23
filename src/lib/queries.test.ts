import { describe, expect, it, vi } from "vitest";

// ── Hoist mock state so vi.mock factories can reference it ────────────────────

const { _setRows, selectMock } = vi.hoisted(() => {
  let rows: unknown[] = [];

  function makeFromResult(result: () => unknown[]) {
    return {
      orderBy: vi.fn().mockImplementation(() => Promise.resolve(result())),
      where: vi.fn().mockImplementation(() => ({
        // getRandomTagline awaits .where() directly
        then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
          Promise.resolve(result()).then(resolve, reject),
      })),
      // make the result directly awaitable (no .orderBy) for getProfile path
      then: (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
        Promise.resolve(result()).then(resolve, reject),
    };
  }

  const selectMock = vi.fn(() => ({ from: vi.fn(() => makeFromResult(() => rows)) }));

  return {
    _setRows: (r: unknown[]) => {
      rows = r;
    },
    selectMock,
  };
});

// ── Mock the DB client before importing the module under test ─────────────────

vi.mock("@/db/client", () => ({
  db: { select: selectMock },
}));

// Also mock the projects module so getProjectsMerged doesn't hit GitHub/DB.
vi.mock("@/lib/projects", () => ({
  getProjects: vi.fn().mockResolvedValue([{ repo: "a", featured: true, hidden: false }]),
}));

// Guard against reintroducing account statistics into the company profile.
const { getCachedUserStatsMock } = vi.hoisted(() => ({ getCachedUserStatsMock: vi.fn() }));
vi.mock("@/lib/github-cache", () => ({ getCachedUserStats: getCachedUserStatsMock }));

// ── Import after mocks are registered ────────────────────────────────────────

import {
  getProfile,
  getProjectsMerged,
  getExperiences,
  getSkills,
  getServices,
  getSocialLinks,
  getRandomTagline,
} from "./queries";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("getProjectsMerged", () => {
  it("delegates to getProjects from projects.ts", async () => {
    const result = await getProjectsMerged();
    expect(result).toEqual([{ repo: "a", featured: true, hidden: false }]);
  });
});

describe("getSocialLinks", () => {
  it("returns rows mapped to SocialRow shape", async () => {
    _setRows([
      {
        platform: "twitter",
        url: "https://twitter.com/a",
        username: "a",
        order: 2,
        id: 2,
      },
      {
        platform: "github",
        url: "https://github.com/b",
        username: "b",
        order: 1,
        id: 1,
      },
    ]);
    const result = await getSocialLinks();
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      platform: "twitter",
      url: "https://twitter.com/a",
      username: "a",
      order: 2,
    });
    expect(result[1]).toEqual({
      platform: "github",
      url: "https://github.com/b",
      username: "b",
      order: 1,
    });
  });

  it("defaults username to empty string when null", async () => {
    _setRows([
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/x",
        username: null,
        order: 0,
        id: 1,
      },
    ]);
    const result = await getSocialLinks();
    expect(result[0].username).toBe("");
  });
});

describe("getProfile", () => {
  const row = {
    id: 1,
    name: "Kodenvia",
    bio: "Desarrollo de software",
    stats: { years: 0, repos: 0, stars: 0, followers: 0 },
    roles: ["Desarrollo web"],
    avatarUrl: null,
    resumeUrl: null,
    sectionVisibility: { projects: true },
  };

  it("preserves the company profile without fetching another account's statistics", async () => {
    getCachedUserStatsMock.mockClear();
    _setRows([row]);
    const result = await getProfile();
    expect(result.name).toBe("Kodenvia");
    expect(result.roles).toEqual(["Desarrollo web"]);
    expect(result.stats).toEqual(row.stats);
    expect(getCachedUserStatsMock).not.toHaveBeenCalled();
  });

  it("does not use a personal portrait or resume as a fallback", async () => {
    _setRows([row]);
    const result = await getProfile();
    expect(result.avatarUrl).toBe("");
    expect(result.resumeUrl).toBe("");
    expect(result.sectionVisibility).toEqual({ projects: true });
  });

  it("preserves explicitly authored statistics", async () => {
    const stats = { years: 2, repos: 3, stars: 4, followers: 5 };
    _setRows([{ ...row, stats }]);
    expect((await getProfile()).stats).toEqual(stats);
  });

  it("throws when the profile is missing", async () => {
    _setRows([]);
    await expect(getProfile()).rejects.toThrow("Profile row not found");
  });
});

describe("getExperiences", () => {
  it("returns individually attributed experience", async () => {
    _setRows([{ id: 1, contributor: "Noe Santiago", role: "Desarrollador", order: 0 }]);
    expect(await getExperiences()).toEqual([
      { id: 1, contributor: "Noe Santiago", role: "Desarrollador", order: 0 },
    ]);
  });

  it("does not publish unattributed legacy experience", async () => {
    _setRows([{ id: 1, contributor: null, role: "Desarrollador", order: 0 }]);
    expect(await getExperiences()).toEqual([]);
  });
});

describe("getSkills", () => {
  it("returns authored technologies", async () => {
    _setRows([{ id: 1, name: "TypeScript", iconPath: "/skills/typescript.svg", order: 0 }]);
    expect((await getSkills())[0].name).toBe("TypeScript");
  });
});

describe("getServices", () => {
  it("returns authored services", async () => {
    _setRows([{ id: 1, title: "Desarrollo web", description: "Aplicaciones web", order: 0 }]);
    expect((await getServices())[0].title).toBe("Desarrollo web");
  });
});

describe("getRandomTagline", () => {
  it("returns text of a random active tagline", async () => {
    _setRows([
      {
        id: "abc",
        text: "Tecnología que impulsa tu negocio",
        active: true,
        order: 0,
        created_at: new Date(),
      },
    ]);
    const result = await getRandomTagline();
    expect(result).toBe("Tecnología que impulsa tu negocio");
  });

  it("returns fallback when no active taglines exist", async () => {
    _setRows([]);
    const result = await getRandomTagline();
    expect(result).toBe("Tecnología que impulsa tu negocio");
  });

  it("returns one of the texts when multiple taglines exist", async () => {
    const taglineTexts = ["Rise above limits", "Think, build, and ship"];
    _setRows(
      taglineTexts.map((text, i) => ({
        id: String(i),
        text,
        active: true,
        order: i,
        created_at: new Date(),
      })),
    );
    const result = await getRandomTagline();
    expect(taglineTexts).toContain(result);
  });
});
