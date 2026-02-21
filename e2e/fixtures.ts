import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/");
    await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const req = indexedDB.deleteDatabase("FeedDb");
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        req.onblocked = () => resolve(false);
      });
    });
    await page.reload();

    await use(page);
  },
});

export { expect } from "@playwright/test";
