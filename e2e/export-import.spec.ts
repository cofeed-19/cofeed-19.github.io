import path from "path";
import fs from "fs";
import os from "os";
import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

test.describe("Export/Import", () => {
  test("should export data as JSON file", async ({ page }) => {
    await setupMockFeed(page);
    await page.fill('input[placeholder*="https://"]', MOCK_FEED_URL);
    await page.click('button:has-text("Add feeds")');
    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();

    await page.locator('summary:has-text("Usage")').click();
    await page.locator('summary:has-text("Export/Import")').click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("Export data")'),
    ]);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const content = fs.readFileSync(downloadPath!, "utf-8");
    const data = JSON.parse(content);

    expect(data).toHaveProperty("db");
    expect(data).toHaveProperty("feed");
    expect(data.feed).toHaveLength(1);
    expect(data.feed[0].url).toBe(MOCK_FEED_URL);
  });

  test("should import data from JSON file and restore feeds", async ({
    page,
  }) => {
    // Create a valid import file
    const importData = {
      db: 2,
      feed: [{ url: MOCK_FEED_URL, visited: [], items: [] }],
      favorites: [],
    };
    const tmpFile = path.join(os.tmpdir(), "cofeed-import-test.json");
    fs.writeFileSync(tmpFile, JSON.stringify(importData));

    await setupMockFeed(page);
    await page.locator('summary:has-text("Usage")').click();
    await page.locator('summary:has-text("Export/Import")').click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(tmpFile);

    // importDataFromFile reloads the page - wait for it
    await page.waitForLoadState("networkidle");
    await setupMockFeed(page);

    await expect(page.locator('h3:has-text("Test Feed")')).toBeVisible();

    fs.unlinkSync(tmpFile);
  });
});
