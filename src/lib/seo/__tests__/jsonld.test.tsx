import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrganizationJsonLd, WebSiteJsonLd, FaqJsonLd } from "../jsonld";

function parse(html: string) {
  return JSON.parse(html);
}

describe("JSON-LD", () => {
  it("emits the company schema with both founders and no borrowed social profiles", () => {
    const { container } = render(<OrganizationJsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const data = parse(script.innerHTML);
    expect(data["@type"]).toBe("Organization");
    expect(Array.isArray(data.sameAs)).toBe(true);
    expect(data.sameAs).toHaveLength(0);
    expect(data.founder.map((founder: { name: string }) => founder.name)).toEqual([
      "Noe Santiago",
      "Brayam Espino",
    ]);
  });

  it("emits a valid WebSite schema", () => {
    const { container } = render(<WebSiteJsonLd />);
    const data = parse(container.querySelector("script")!.innerHTML);
    expect(data["@type"]).toBe("WebSite");
    expect(data.url).toMatch(/^https?:\/\//);
  });

  it("emits a valid FAQPage schema with mainEntity questions", () => {
    const { container } = render(
      <FaqJsonLd faqs={[{ question: "Who is Kodenvia?", answer: "An engineer." }]} />,
    );
    const data = parse(container.querySelector("script")!.innerHTML);
    expect(data["@type"]).toBe("FAQPage");
    expect(Array.isArray(data.mainEntity)).toBe(true);
    expect(data.mainEntity.length).toBeGreaterThan(0);
    const first = data.mainEntity[0];
    expect(first["@type"]).toBe("Question");
    expect(typeof first.name).toBe("string");
    expect(first.acceptedAnswer["@type"]).toBe("Answer");
    expect(typeof first.acceptedAnswer.text).toBe("string");
  });
});
