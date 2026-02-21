import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

const UPDATED_FEED = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Test Article 3</title>
      <link>https://example.com/article3</link>
      <pubDate>Tue, 21 Feb 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Test Article 1</title>
      <link>https://example.com/article1</link>
      <pubDate>Mon, 20 Feb 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Test Article 2</title>
      <link>https://example.com/article2</link>
      <pubDate>Sun, 19 Feb 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

test.describe("Local-first feed loading", () => {
  test("should show cached items before network fetch completes", async ({ page }) => {
    // First visit: add feed, let it fetch and persist items
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    // Wait for items to be persisted to IndexedDB
    await page.waitForTimeout(500);

    // Second visit: intercept the RSS fetch so it never resolves,
    // feed header and items should still appear from IndexedDB cache
    await page.route(MOCK_FEED_URL, () => { /* never fulfills */ });
    await page.reload();

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 2")')).toBeVisible();
  });

  test("should update DOM with fresh data after network fetch", async ({ page }) => {
    // First visit: add feed with original articles
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await page.waitForTimeout(500);

    // Second visit: serve updated feed with a new article
    await page.route(MOCK_FEED_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/rss+xml", body: UPDATED_FEED })
    );
    await page.reload();

    // New article should appear after fetch completes
    await expect(page.locator('a:has-text("Test Article 3")')).toBeVisible();
  });

  test("should persist fresh data to DB after network fetch", async ({ page }) => {
    // First visit: add feed with original articles
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');
    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await page.waitForTimeout(500);

    // Second visit: serve updated feed, wait for it to persist
    await page.route(MOCK_FEED_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/rss+xml", body: UPDATED_FEED })
    );
    await page.reload();
    await expect(page.locator('a:has-text("Test Article 3")')).toBeVisible();
    await page.waitForTimeout(500);

    // Third visit: block network — feed header and updated article must still appear from DB
    await page.route(MOCK_FEED_URL, () => { /* never fulfills */ });
    await page.reload();

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 3")')).toBeVisible();
  });
});
