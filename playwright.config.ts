import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 4000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid E2E_PORT");
const production = Boolean(process.env.CI || process.env.E2E_PRODUCTION);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: production ? `node node_modules/next/dist/bin/next start -p ${port}` : "bun run dev",
    url: baseURL,
    reuseExistingServer: !production,
    timeout: 120_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://build:build@localhost:5432/build",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "ci-dummy-secret",
    },
  },
});
