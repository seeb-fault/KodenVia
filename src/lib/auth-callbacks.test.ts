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
  it("allows each configured admin and ignores surrounding spaces", () => {
    const admins = " seeb-fault, SECOND-ADMIN , ";
    expect(isAllowedLogin("seeb-fault", admins)).toBe(true);
    expect(isAllowedLogin("second-admin", admins)).toBe(true);
  });
  it("rejects partial matches and unlisted users", () => {
    const admins = "seeb-fault,second-admin";
    expect(isAllowedLogin("seeb", admins)).toBe(false);
    expect(isAllowedLogin("second-admin-extra", admins)).toBe(false);
    expect(isAllowedLogin("someone-else", admins)).toBe(false);
  });
  it.each(["", " ", ",", " , , "])("rejects empty configuration %j", (admins) => {
    expect(isAllowedLogin("seeb-fault", admins)).toBe(false);
    expect(isAllowedLogin("", admins)).toBe(false);
    expect(isAllowedLogin(" ", admins)).toBe(false);
  });
});
