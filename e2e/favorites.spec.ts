import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

async function addFeedAndFavoriteFirstItem(page: import("@playwright/test").Page) {
  await setupMockFeed(page);
  await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
  await page.click('button:has-text("Add feeds")');
  await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();

  const btn = page.locator('[data-testid="favorite-button"]').first();
  await btn.evaluate((el) => (el as HTMLElement).click());
}

test.describe("Favorites", () => {
  test("should add item to favorites and view in favorites tab", async ({
    page,
  }) => {
    await addFeedAndFavoriteFirstItem(page);

    await page.click('button:has-text("Favorites")');
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
  });

  test("should remove item from favorites", async ({ page }) => {
    await addFeedAndFavoriteFirstItem(page);

    await page.click('button:has-text("Favorites")');
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator('[title="Remove from favorites"]').first().click();

    await expect(page.locator('a:has-text("Test Article 1")')).not.toBeVisible();
  });
});
