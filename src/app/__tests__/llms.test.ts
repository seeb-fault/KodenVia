import { describe, expect, it, vi } from "vitest";

// The route fetches FAQs from the DB; mock it so the test needs no database.
vi.mock("@/lib/queries", () => ({
  getFaqs: async () => [
    { id: 1, question: "¿Qué hace Kodenvia?", answer: "Desarrollo de software.", order: 0 },
  ],
}));

import { GET } from "../llms.txt/route";

describe("llms.txt", () => {
  it("serves plain text with the entity-first identity and FAQ", async () => {
    const res = await GET();
    expect(res.headers.get("Content-Type")).toMatch(/text\/plain/);
    const text = await res.text();
    expect(text).toContain("Kodenvia");
    expect(text).toContain("## Preguntas frecuentes");
    expect(text).toContain("llms-full.txt");
  });

  it("contains the identity section", async () => {
    const res = await GET();
    const text = await res.text();
    expect(text).toContain("## Empresa");
    expect(text).toContain("Noe Santiago");
    expect(text).toContain("Brayam Espino");
  });

  it("contains GitHub link", async () => {
    const res = await GET();
    const text = await res.text();
    expect(text).toContain("https://wa.me/51945984518");
  });

  it("contains at least one FAQ question", async () => {
    const res = await GET();
    const text = await res.text();
    expect(text).toContain("¿Qué hace Kodenvia?");
  });
});
