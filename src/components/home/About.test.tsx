import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

vi.mock("@/components/motion/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// JSDOM puede no disponer de matchMedia; el test no necesita animaciones.
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
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

  it("renders the approved conceptual founder portraits without personal portfolio data", () => {
    render(<About profile={{ ...profile, avatarUrl: "/test-avatar.png" }} />);
    expect(screen.getByText("Noe Santiago")).toBeInTheDocument();
    expect(screen.getByText("Elvis Espino")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Noe Santiago.*sin lentes/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Elvis Espino.*con lentes/ })).toBeInTheDocument();
    expect(screen.queryByText("120+")).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /test-avatar/ })).not.toBeInTheDocument();
  });
});
