/** Pure admin gate: exact match against the configured comma-separated GitHub logins. */
export function isAllowedLogin(
  login: string | null | undefined,
  adminLogins: string | undefined,
): boolean {
  const normalizedLogin = login?.trim().toLowerCase();
  if (!normalizedLogin || !adminLogins) return false;
  return adminLogins
    .split(",")
    .some((allowedLogin) => allowedLogin.trim().toLowerCase() === normalizedLogin);
}
