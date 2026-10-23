import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "../Faq";

// Stub FaqJsonLd — it emits a <script> tag which is opaque in jsdom
vi.mock("@/lib/seo/jsonld", () => ({
  FaqJsonLd: () => null,
}));

const faqs = [
  {
    question: "Who is Kodenvia?",
    answer:
      "Kodenvia is a Software Development Engineer and AI Lead from India who builds reliable products.",
  },
  { question: "What does Kodenvia build?", answer: "Full-stack web and mobile products." },
  { question: "What is Kodenvia's tech stack?", answer: "TypeScript, React, Next.js, Node.js." },
  {
    question: "Is Kodenvia available for collaboration?",
    answer: "Yes, open to collaboration and freelance work.",
  },
  { question: "How can I contact Kodenvia?", answer: "Email is the fastest way." },
];

describe("Faq", () => {
  it("renders the FAQ section with id='faq'", () => {
    const { container } = render(<Faq faqs={faqs} />);
    expect(container.querySelector("#faq")).toBeTruthy();
  });

  it("renders the section heading", () => {
    render(<Faq faqs={faqs} />);
    expect(screen.getByText(/Preguntas frecuentes/i)).toBeTruthy();
  });

  it("renders all FAQ questions", () => {
    render(<Faq faqs={faqs} />);
    expect(screen.getByText("Who is Kodenvia?")).toBeTruthy();
    expect(screen.getByText("What does Kodenvia build?")).toBeTruthy();
    expect(screen.getByText("What is Kodenvia's tech stack?")).toBeTruthy();
    expect(screen.getByText("Is Kodenvia available for collaboration?")).toBeTruthy();
    expect(screen.getByText("How can I contact Kodenvia?")).toBeTruthy();
  });

  it("returns nothing when there are no FAQs", () => {
    const { container } = render(<Faq faqs={[]} />);
    expect(container.querySelector("#faq")).toBeNull();
  });

  it("answers are hidden by default (hidden attribute)", () => {
    const { container } = render(<Faq faqs={faqs} />);
    const regions = container.querySelectorAll("[role='region']");
    regions.forEach((region) => {
      expect(region.hasAttribute("hidden")).toBe(true);
    });
  });

  it("toggles an answer open when its button is clicked", async () => {
    render(<Faq faqs={faqs} />);
    const button = screen.getByRole("button", { name: /Who is Kodenvia/i });
    expect(button.getAttribute("aria-expanded")).toBe("false");

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");

    // The answer text is now visible (hidden attribute removed)
    expect(screen.getByText(/Software Development Engineer and AI Lead/)).toBeTruthy();
  });

  it("collapses the answer when the button is clicked again", async () => {
    render(<Faq faqs={faqs} />);
    const button = screen.getByRole("button", { name: /Who is Kodenvia/i });

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");

    await userEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("each button has aria-controls referencing its answer region", () => {
    const { container } = render(<Faq faqs={faqs} />);
    const buttons = container.querySelectorAll("button[aria-expanded]");
    buttons.forEach((btn) => {
      const controlsId = btn.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(container.querySelector(`#${controlsId}`)).toBeTruthy();
    });
  });
});
