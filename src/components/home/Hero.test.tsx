import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { installMatchMedia } from "@/test/matchMedia";
import { Hero } from "./Hero";

beforeEach(() => installMatchMedia());
afterEach(cleanup);

const profile = {
  name: "Kodenvia",
  roles: ["Full Stack Developer", "Flutter Developer"],
};

describe("Hero", () => {
  it("renders the name as the h1, split across two display lines", () => {
    render(<Hero profile={profile} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/kodenvia/i);
    expect(h1).not.toHaveTextContent(/template-owner/i);
  });

  it("renders the hero tagline chip", () => {
    render(<Hero profile={profile} heroTagline="Building AI-native products" />);
    expect(screen.getByText(/building ai-native products/i)).toBeInTheDocument();
  });

  it("omits the chip without a hero tagline", () => {
    render(<Hero profile={profile} />);
    expect(screen.queryByText(/building ai-native products/i)).not.toBeInTheDocument();
  });

  it("renders the roles marquee as decorative", () => {
    render(<Hero profile={profile} />);
    const marquee = screen.getByTestId("hero-marquee");
    expect(marquee).toHaveAttribute("aria-hidden", "true");
    expect(marquee).toHaveTextContent("Full Stack Developer");
  });

  it("links to services and contact", () => {
    render(<Hero profile={profile} />);
    expect(screen.getByRole("link", { name: /nuestros servicios/i })).toHaveAttribute(
      "href",
      "#services",
    );
    expect(screen.getByRole("link", { name: /hablemos de tu idea/i })).toHaveAttribute(
      "href",
      "#contact",
    );
  });

  it("renders no avatar image and no scroll chevron", () => {
    render(<Hero profile={profile} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/scroll/i)).not.toBeInTheDocument();
  });
});
