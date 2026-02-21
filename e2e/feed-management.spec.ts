import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

test.describe("Feed Management", () => {
  test("should add a feed and display items", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 2")')).toBeVisible();
  });

  test("should mark item as visited on click", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(2);

    await page.click('a:has-text("Test Article 1")');
    await page.waitForTimeout(500);

    await page.reload();
    await setupMockFeed(page);

    await page.locator('summary:has-text("Visited from")').click();

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="visited-item"]')).toHaveCount(1);
  });

  test("should remove a feed", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.click('h3:has-text("Test Feed") >> button:has-text("❌")');

    await expect(page.locator('h3:has-text("Test Feed")')).not.toBeVisible();
  });
});
