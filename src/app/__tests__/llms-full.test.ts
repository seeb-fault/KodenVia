import { describe, expect, it, vi, beforeEach } from "vitest";

const loaders = vi.hoisted(() => ({
  getProfile: vi.fn(),
  getServices: vi.fn(),
  getFaqs: vi.fn(),
  getProjectsMerged: vi.fn(),
  getExperiences: vi.fn(),
  getSkills: vi.fn(),
}));
vi.mock("@/lib/queries", () => loaders);
import { GET } from "../llms-full.txt/route";

beforeEach(() => {
  vi.clearAllMocks();
  loaders.getProjectsMerged.mockResolvedValue([]);
  loaders.getExperiences.mockResolvedValue([]);
  loaders.getSkills.mockResolvedValue([]);
  loaders.getProfile.mockResolvedValue({
    name: "Kodenvia",
    bio: "Contenido de la empresa.",
    roles: ["Desarrollo web"],
    sectionVisibility: {},
  });
  loaders.getServices.mockResolvedValue([
    { title: "Desarrollo web", description: "Sitios a medida." },
  ]);
  loaders.getFaqs.mockResolvedValue([
    { question: "¿Cómo empezamos?", answer: "Con una conversación." },
  ]);
});

describe("llms-full.txt", () => {
  it("serves company data and real contact details as plain text", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    const text = await response.text();
    expect(text).toContain("# Kodenvia");
    expect(text).toContain("Noe Santiago y Brayam Espino");
    expect(text).toContain("Contenido de la empresa.");
    expect(text).toContain("Sitios a medida.");
    expect(text).toContain("sebbfaultsoul@gmail.com");
    expect(text).not.toContain("santiago-noe");
  });

  it("does not query or expose sections disabled by the admin", async () => {
    loaders.getProfile.mockResolvedValue({
      name: "Kodenvia",
      bio: "Hidden company biography.",
      roles: [],
      sectionVisibility: {
        services: false,
        faq: false,
        about: false,
        contact: false,
        projects: false,
        experience: false,
        skills: false,
      },
    });
    const text = await (await GET()).text();
    expect(loaders.getServices).not.toHaveBeenCalled();
    expect(loaders.getFaqs).not.toHaveBeenCalled();
    expect(loaders.getProjectsMerged).not.toHaveBeenCalled();
    expect(loaders.getExperiences).not.toHaveBeenCalled();
    expect(loaders.getSkills).not.toHaveBeenCalled();
    for (const heading of [
      "## Servicios",
      "## Preguntas frecuentes",
      "## Nosotros",
      "## Contacto",
    ]) {
      expect(text).not.toContain(heading);
    }
    expect(text).not.toContain("Hidden company biography.");
  });
});
