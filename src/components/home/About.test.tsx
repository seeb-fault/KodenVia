import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

vi.mock("@/components/motion/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const profile = {
  bio: "Somos un equipo de dos socios.\n\nCreamos soluciones para tu negocio.",
  stats: { years: 4, repos: 120, stars: 250, followers: 87 },
};

describe("About", () => {
  it("keeps database-authored paragraphs separate", () => {
    render(<About profile={profile} />);
    expect(screen.getByText("Somos un equipo de dos socios.")).toBeInTheDocument();
    expect(screen.getByText("Creamos soluciones para tu negocio.")).toBeInTheDocument();
  });

  it("presents both founders without reusing personal portfolio metrics or portraits", () => {
    render(<About profile={{ ...profile, avatarUrl: "/test-avatar.png" }} />);
    expect(screen.getByText("Noe Santiago")).toBeInTheDocument();
    expect(screen.getByText("Brayam Espino")).toBeInTheDocument();
    expect(screen.getAllByText("Socio fundador")).toHaveLength(2);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText("120+")).not.toBeInTheDocument();
  });
});
