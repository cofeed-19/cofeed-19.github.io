import { test, expect } from "./fixtures";

test.describe("Error Handling", () => {
  test("should show error alert for invalid feed URL", async ({ page }) => {
    // Route to simulate a CORS/network error
    await page.route("https://invalid-feed.example.com/feed.xml", (route) =>
      route.abort("failed")
    );

    await page.fill(
      'input[placeholder*="https://"]',
      "https://invalid-feed.example.com/feed.xml"
    );

    const [dialog] = await Promise.all([
      page.waitForEvent("dialog"),
      page.click('button:has-text("Add feeds")'),
    ]);

    expect(dialog.message()).toContain("Could not add");
    await dialog.accept();
  });

  test("should not add invalid feed to the list", async ({ page }) => {
    await page.route("https://invalid-feed.example.com/feed.xml", (route) =>
      route.abort("failed")
    );

    await page.fill(
      'input[placeholder*="https://"]',
      "https://invalid-feed.example.com/feed.xml"
    );

    page.once("dialog", (dialog) => dialog.accept());
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator("section")).toHaveCount(0);
  });
});
