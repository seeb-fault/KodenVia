import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders an svg with accessible name matching /kodenvia/i", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /kodenvia/i })).toBeInTheDocument();
  });

  it("renders wordmark 'Kodenvia' when withWordmark is true", () => {
    render(<Logo withWordmark />);
    expect(screen.getByText("Kodenvia")).toBeInTheDocument();
  });

  it("does NOT render wordmark by default", () => {
    render(<Logo />);
    expect(screen.queryByText("Kodenvia")).not.toBeInTheDocument();
  });
});
