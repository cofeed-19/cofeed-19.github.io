import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

test.describe("Mark All as Visited", () => {
  test("should mark all items as visited", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(2);

    page.once("dialog", (dialog) => dialog.accept());
    await page.click('button:has-text("Mark all as visited")');

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(0);
  });

  test("should persist mark all as visited after reload", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');

    page.once("dialog", (dialog) => dialog.accept());
    await page.click('button:has-text("Mark all as visited")');
    await page.waitForTimeout(500);

    await page.reload();
    await setupMockFeed(page);

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(0);
    await page.locator('summary:has-text("Visited from")').click();
    await expect(page.locator('[data-testid="visited-item"]')).toHaveCount(2);
  });
});
