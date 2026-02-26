import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

const FEED_WITH_WHITESPACE_LINKS = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <link>https://example.com</link>
    <item>
      <title>Test Article 1</title>
      <link>
https://example.com/article1
</link>
      <pubDate>Mon, 20 Feb 2026 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Test Article 2</title>
      <link>
https://example.com/article2
</link>
      <pubDate>Sun, 19 Feb 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

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

  test("should mark item as visited when link has surrounding whitespace", async ({ page }) => {
    await page.route(MOCK_FEED_URL, (route) =>
      route.fulfill({ status: 200, contentType: "application/rss+xml", body: FEED_WITH_WHITESPACE_LINKS })
    );
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');
    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(2);

    await page.locator('[data-testid="new-item"] a').first().click();

    await expect(page.locator('[data-testid="new-item"]')).toHaveCount(1);
  });
});
