import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { MergedProject } from "@/lib/projects";

// Suppress Meteors animation side effects in jsdom
vi.mock("@/components/ui/Meteors", () => ({
  Meteors: () => null,
}));

const base: MergedProject = {
  details: {},
  id: 1,
  repo: "rippl",
  title: "Rippl",
  customBlurb: "A thing.",
  tags: ["Flutter"],
  featured: true,
  order: 0,
  hidden: false,
  stars: 42,
  forks: 7,
  language: "Dart",
  description: "A thing.",
  homepage: null,
  htmlUrl: "https://github.com/santiago-noe/rippl",
  coverImage: null,
  screenshots: [],
  readmeExcerpt: null,
};

describe("ProjectCard", () => {
  it("renders live stars and forks", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByLabelText("42 stars")).toBeInTheDocument();
    expect(screen.getByLabelText("7 forks")).toBeInTheDocument();
  });

  it("labels a single star or fork in the singular", () => {
    render(<ProjectCard project={{ ...base, stars: 1, forks: 1 }} />);
    expect(screen.getByLabelText("1 star")).toBeInTheDocument();
    expect(screen.getByLabelText("1 fork")).toBeInTheDocument();
  });

  it("omits unconfirmed counts rather than presenting zero", () => {
    render(<ProjectCard project={{ ...base, stars: null, forks: null }} />);
    expect(screen.queryByLabelText("0 stars")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("0 forks")).not.toBeInTheDocument();
  });

  it("omits the Live link when there is no homepage", () => {
    render(<ProjectCard project={base} />);
    expect(screen.queryByText("Ver sitio")).not.toBeInTheDocument();
  });

  it("shows the Live link when a homepage exists", () => {
    render(<ProjectCard project={{ ...base, homepage: "https://x.dev" }} />);
    expect(screen.getByText("Ver sitio")).toBeInTheDocument();
  });

  it("does not invent a repository for a project without confirmed public links", () => {
    render(
      <ProjectCard
        project={{
          ...base,
          htmlUrl: null,
          stars: null,
          forks: null,
          details: {
            contributor: "Noe Santiago",
            status: "prototype",
            role: "Desarrollador",
            period: "2026",
          },
        }}
      />,
    );
    expect(screen.queryByText("Código")).not.toBeInTheDocument();
    expect(screen.getByText("Prototipo funcional local")).toBeInTheDocument();
    expect(screen.getByText("Noe Santiago")).toBeInTheDocument();
    expect(screen.getByText("Desarrollador")).toBeInTheDocument();
  });

  it("renders the project title", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Rippl")).toBeInTheDocument();
  });

  it("renders Code link pointing to GitHub URL", () => {
    render(<ProjectCard project={base} />);
    const codeLink = screen.getByText("Código").closest("a");
    expect(codeLink).toHaveAttribute("href", "https://github.com/santiago-noe/rippl");
  });

  it("opens Code and Live links in a new tab (target=_blank)", () => {
    render(<ProjectCard project={{ ...base, homepage: "https://example.com" }} />);
    const codeLink = screen.getByText("Código").closest("a");
    expect(codeLink).toHaveAttribute("target", "_blank");
    expect(codeLink).toHaveAttribute("rel", "noopener noreferrer");
    const liveLink = screen.getByText("Ver sitio").closest("a");
    expect(liveLink).toHaveAttribute("target", "_blank");
    expect(liveLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders tech tags as badge pills", () => {
    render(<ProjectCard project={base} />);
    expect(screen.getByText("Flutter")).toBeInTheDocument();
    expect(screen.getByText("Dart")).toBeInTheDocument();
  });
});
