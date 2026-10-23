import { describe, expect, it } from "vitest";
import { isAllowedLogin } from "./auth-callbacks";

describe("isAllowedLogin", () => {
  it("allows the configured admin login (case-insensitive)", () => {
    expect(isAllowedLogin("santiago-noe", "santiago-noe")).toBe(true);
    expect(isAllowedLogin("SANTIAGO-NOE", "santiago-noe")).toBe(true);
  });
  it("rejects any other login", () => {
    expect(isAllowedLogin("someone-else", "santiago-noe")).toBe(false);
  });
  it("rejects null/undefined login", () => {
    expect(isAllowedLogin(null, "santiago-noe")).toBe(false);
    expect(isAllowedLogin(undefined, "santiago-noe")).toBe(false);
  });
  it("rejects everyone when admin login is unset", () => {
    expect(isAllowedLogin("santiago-noe", undefined)).toBe(false);
  });
});
