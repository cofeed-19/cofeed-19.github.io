import { test, expect } from "./fixtures";
import { MOCK_RSS_FEED } from "./helpers/mockFeeds";

const FEED_URL_1 = "https://example.com/feed1.xml";
const FEED_URL_2 = "https://example.com/feed2.xml";

const MOCK_RSS_FEED_2 = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>Second Feed</title>
    <link>https://example2.com</link>
    <item>
      <title>Second Article 1</title>
      <link>https://example2.com/article1</link>
      <pubDate>Mon, 20 Feb 2026 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

async function setupTwoMockFeeds(page: import("@playwright/test").Page) {
  await page.route(FEED_URL_1, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/rss+xml",
      body: MOCK_RSS_FEED,
    })
  );
  await page.route(FEED_URL_2, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/rss+xml",
      body: MOCK_RSS_FEED_2,
    })
  );
}

test.describe("Multiple Feeds", () => {
  test("should add multiple feeds at once via comma-separated URLs", async ({
    page,
  }) => {
    await setupTwoMockFeeds(page);

    await page.fill(
      'input[placeholder*="https://"]',
      `${FEED_URL_1},${FEED_URL_2}`
    );
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('h3:has-text("Second Feed")')).toBeVisible();
  });

  test("should show items from both feeds", async ({ page }) => {
    await setupTwoMockFeeds(page);

    await page.fill(
      'input[placeholder*="https://"]',
      `${FEED_URL_1},${FEED_URL_2}`
    );
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await expect(page.locator('a:has-text("Second Article 1")')).toBeVisible();
  });
});
