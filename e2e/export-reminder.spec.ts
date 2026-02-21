import { test, expect } from "./fixtures";
import { LAST_EXPORT_KEY } from "../src/services/exportReminderService";

const STALE_EXPORT_DATE_MS = 31 * 24 * 60 * 60 * 1000;

async function setExportDate(page: import("@playwright/test").Page, timestamp: number) {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: LAST_EXPORT_KEY, value: timestamp.toString() }
  );
  await page.reload();
}

test.describe("Export Reminder Dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate((key) => localStorage.removeItem(key), LAST_EXPORT_KEY);
  });

  test("shows dialog when last export was over 30 days ago", async ({
    page,
  }) => {
    await setExportDate(page, Date.now() - STALE_EXPORT_DATE_MS);

    await expect(page.locator("dialog")).toBeVisible();
    await expect(page.locator("dialog p").first()).toContainText(
      "over a month since your last export"
    );
  });

  test("does not show dialog when last export is recent", async ({ page }) => {
    await setExportDate(page, Date.now());

    await expect(page.locator("dialog")).not.toBeVisible();
  });

  test('"Export now" downloads file and closes dialog', async ({ page }) => {
    await setExportDate(page, Date.now() - STALE_EXPORT_DATE_MS);

    await expect(page.locator("dialog")).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("Export now")'),
    ]);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    await expect(page.locator("dialog")).not.toBeVisible();
  });

  test('"Remind me next month" dismisses dialog and resets timer', async ({
    page,
  }) => {
    await setExportDate(page, Date.now() - STALE_EXPORT_DATE_MS);

    await expect(page.locator("dialog")).toBeVisible();

    await page.click('button:has-text("Remind me next month")');

    await expect(page.locator("dialog")).not.toBeVisible();

    const updatedDate = await page.evaluate(
      (key) => localStorage.getItem(key),
      LAST_EXPORT_KEY
    );
    expect(Number(updatedDate)).toBeGreaterThan(Date.now() - 5000);
  });
});
