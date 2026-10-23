import { describe, expect, it } from "vitest";
import { getProjectLinks, getRepositorySlug } from "./project-details";

describe("confirmed project links", () => {
  it("does not derive public links from an internal project identifier", () => {
    expect(getProjectLinks({ details: {}, htmlUrl: null, homepage: null })).toEqual({
      repository: null,
      website: null,
    });
  });

  it("extracts only an explicit GitHub repository, not a profile or unrelated URL", () => {
    expect(getRepositorySlug("https://github.com/santiago-noe/qatu-app")).toBe(
      "santiago-noe/qatu-app",
    );
    for (const url of [
      "https://github.com/santiago-noe",
      "https://example.com/user/repo",
      "https://github.com/user/repo/tree/main",
      "javascript:alert(1)",
    ]) {
      expect(getRepositorySlug(url)).toBeNull();
    }
  });
});
