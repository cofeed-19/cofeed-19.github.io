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

test.describe("Feed Pinning", () => {
  test("should pin a feed and move it to the top", async ({ page }) => {
    await setupTwoMockFeeds(page);
    await page.fill(
      'input[placeholder*="https://"]',
      `${FEED_URL_1},${FEED_URL_2}`
    );
    await page.click('button:has-text("Add feeds")');

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();
    await expect(page.locator('h3:has-text("Second Feed")')).toBeVisible();

    // Pin the second feed
    const secondFeedPin = page
      .locator('section:has(h3:has-text("Second Feed")) abbr[title="Pin"]');
    await secondFeedPin.click();

    // Second Feed should now appear first
    const sections = page.locator("section");
    await expect(sections.first().locator("h3")).toContainText("Second Feed");
  });

  test("should unpin a feed", async ({ page }) => {
    await setupTwoMockFeeds(page);
    await page.fill(
      'input[placeholder*="https://"]',
      `${FEED_URL_1},${FEED_URL_2}`
    );
    await page.click('button:has-text("Add feeds")');

    // Pin second feed
    const pin = page.locator('section:has(h3:has-text("Second Feed")) abbr');
    await pin.click();
    await expect(page.locator("section").first().locator("h3")).toContainText("Second Feed");

    // Unpin it
    const unpin = page.locator('section:has(h3:has-text("Second Feed")) abbr[title="Unpin"]');
    await unpin.click();

    // Order should revert - Test Feed first again
    await expect(page.locator("section").first().locator("h3")).toContainText("Test Feed");
  });
});
