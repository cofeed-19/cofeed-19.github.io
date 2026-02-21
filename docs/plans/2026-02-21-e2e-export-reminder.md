# Export Reminder Dialog E2E Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add E2E tests for the monthly export reminder dialog introduced in PR #91.

**Architecture:** New spec file `e2e/export-reminder.spec.ts` using Playwright. Tests manipulate `localStorage.cofeed_last_export_date` via `page.addInitScript()` before page load to control dialog visibility. The fixture already clears IndexedDB; each test that needs a stale date sets it via `addInitScript`, and each test that needs a clean state clears it.

**Tech Stack:** Playwright, TypeScript, existing `e2e/fixtures.ts` pattern.

---

### Task 1: Create new branch

**Files:**
- N/A (git only)

**Step 1: Create and switch to branch**

```bash
git checkout -b e2e-export-reminder
```

**Step 2: Verify branch**

```bash
git branch --show-current
```
Expected: `e2e-export-reminder`

---

### Task 2: Write failing tests for dialog visibility

**Files:**
- Create: `e2e/export-reminder.spec.ts`

**Step 1: Create the spec file with all 4 tests**

```typescript
import { test, expect } from "./fixtures";

const LAST_EXPORT_KEY = "cofeed_last_export_date";
const THIRTY_ONE_DAYS_MS = 31 * 24 * 60 * 60 * 1000;

test.describe("Export Reminder Dialog", () => {
  test("shows dialog when last export was over 30 days ago", async ({
    page,
  }) => {
    const staleDate = (Date.now() - THIRTY_ONE_DAYS_MS).toString();
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: LAST_EXPORT_KEY, value: staleDate }
    );
    await page.reload();

    await expect(page.locator("dialog")).toBeVisible();
    await expect(
      page.locator("p:has-text(\"It's been over a month\")")
    ).toBeVisible();
  });

  test("does not show dialog when last export is recent", async ({ page }) => {
    const recentDate = Date.now().toString();
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: LAST_EXPORT_KEY, value: recentDate }
    );
    await page.reload();

    await expect(page.locator("dialog")).not.toBeVisible();
  });

  test('"Export now" downloads file and closes dialog', async ({ page }) => {
    const staleDate = (Date.now() - THIRTY_ONE_DAYS_MS).toString();
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: LAST_EXPORT_KEY, value: staleDate }
    );
    await page.reload();

    await expect(page.locator("dialog")).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("Export now")'),
    ]);

    expect(download).toBeTruthy();
    await expect(page.locator("dialog")).not.toBeVisible();
  });

  test('"Remind me next month" dismisses dialog and resets timer', async ({
    page,
  }) => {
    const staleDate = (Date.now() - THIRTY_ONE_DAYS_MS).toString();
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: LAST_EXPORT_KEY, value: staleDate }
    );
    await page.reload();

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
```

**Step 2: Run tests to verify they fail (spec file exists but behavior not yet verified)**

```bash
npx playwright test e2e/export-reminder.spec.ts --reporter=line
```
Expected: Some tests may fail if `addInitScript` runs after fixture's `page.reload()`. Observe actual failures to confirm approach works.

**Step 3: Commit the spec**

```bash
git add e2e/export-reminder.spec.ts
git commit -m "test: add E2E tests for export reminder dialog"
```

---

### Task 3: Fix localStorage timing if needed

> Only needed if tests fail because `addInitScript` scripts don't persist across the fixture's `page.reload()`.

The fixture in `e2e/fixtures.ts` calls `page.goto("/")` then `page.reload()`. Scripts added via `addInitScript` **do** persist across reloads for the same page instance, so this should work. But if tests fail with "dialog not visible" when stale date is set, the issue is that the fixture's final `page.reload()` runs **after** our `addInitScript` is registered — which is correct. No fix needed unless tests prove otherwise.

**If tests still fail:** Check whether `shouldShowExportReminder()` in `src/services/exportReminderService.ts` is being called. The issue may be that the fixture clears localStorage via IndexedDB delete but does NOT clear `cofeed_last_export_date`. Verify by adding a `localStorage.clear()` to the fixture or clearing just that key.

**Files (only if fix needed):**
- Modify: `e2e/fixtures.ts`

```typescript
// Add localStorage clear inside the fixture, after indexedDB delete:
await page.evaluate(() => localStorage.removeItem("cofeed_last_export_date"));
```

**Step 1: Run tests again after any fix**

```bash
npx playwright test e2e/export-reminder.spec.ts --reporter=line
```
Expected: All 4 tests PASS

**Step 2: Commit fix if made**

```bash
git add e2e/fixtures.ts
git commit -m "test: clear export reminder localStorage in fixture"
```

---

### Task 4: Run full E2E suite and verify no regressions

**Step 1: Run all E2E tests**

```bash
npx playwright test --reporter=line
```
Expected: All tests pass, no regressions.

**Step 2: If all pass, commit plan doc**

```bash
git add docs/plans/2026-02-21-e2e-export-reminder.md
git commit -m "docs: add E2E export reminder plan"
```
