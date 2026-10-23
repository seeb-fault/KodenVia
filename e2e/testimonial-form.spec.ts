import { expect, test } from "@playwright/test";

test("testimonial form page loads", async ({ page }) => {
  await page.goto("/testimonials/new");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/comparte tu experiencia/i);
});

test("honeypot field is present and invisible to users", async ({ page }) => {
  await page.goto("/testimonials/new");
  const honeypot = page.locator('input[name="website"]');
  await expect(honeypot).toHaveCount(1);
  // The honeypot wrapper is positioned off-screen (left: -9999px) + aria-hidden.
  // The input itself isn't display:none but its bounding box should be off-screen.
  const box = await honeypot.boundingBox();
  // Off-screen: x will be deeply negative (around -9999px from viewport)
  const isOffScreen = box === null || box.x < -100;
  expect(isOffScreen).toBe(true);
});

test("form has required fields for name, relationship, and content", async ({ page }) => {
  await page.goto("/testimonials/new");
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="relationship"]')).toBeVisible();
  await expect(page.locator('textarea[name="content"]')).toBeVisible();
});
