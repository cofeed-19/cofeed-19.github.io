import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

test.describe("Data Persistence", () => {
  test("should persist feeds across page reloads", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();

    await page.reload();
    await setupMockFeed(page);

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
  });

  test("should persist visited state across reloads", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await page.click('a:has-text("Test Article 1")');
    // wait for async IndexedDB write to complete
    await page.waitForTimeout(500);

    await page.reload();
    await setupMockFeed(page);

    // open the visited <details> section
    await page.locator('summary:has-text("Visited from")').click();

    await expect(page.locator('[data-testid="visited-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(1);
  });
});
