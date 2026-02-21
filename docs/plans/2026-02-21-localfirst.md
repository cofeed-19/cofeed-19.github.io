# Local-First Feed Loading Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show cached feed items instantly on page load, then update with fresh data from RSS fetch in the background.

**Architecture:** Two changes to `useFeedQuery.ts`: (1) pass `storedFeed.items` as placeholder data so cached items render immediately, (2) call `updateSiteFeed` after a successful fetch to persist fresh items back to IndexedDB for future sessions.

**Tech Stack:** React, TanStack Query (`useQuery`), IndexedDB via `idb`, `rss-parser`

---

### Task 1: Write failing E2E test for local-first behavior

**Files:**
- Create: `e2e/localfirst.spec.ts`

**Step 1: Write the failing test**

Create `e2e/localfirst.spec.ts`:
```ts
import { test, expect } from "./fixtures";
import { setupMockFeed, MOCK_FEED_URL } from "./helpers/mockFeeds";

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
    // items should still appear from IndexedDB cache
    await page.route(MOCK_FEED_URL, () => { /* never fulfills */ });
    await page.reload();

    await expect(page.locator('a:has-text("Test Article 1")')).toBeVisible();
    await expect(page.locator('a:has-text("Test Article 2")')).toBeVisible();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
yarn test:e2e e2e/localfirst.spec.ts
```
Expected: FAIL — articles not visible because `items: []` is used as placeholder

**Step 3: Commit the failing test**

```bash
git add e2e/localfirst.spec.ts
git commit -m "test: failing E2E for local-first feed loading"
```

---

### Task 2: Show cached items as placeholder data

**Files:**
- Modify: `src/hooks/useFeedQuery.ts`

**Step 1: Change `placeholderData`**

In `src/hooks/useFeedQuery.ts`, change line 26 from:
```ts
placeholderData: { ...storedFeed, items: [], loaded: false },
```
to:
```ts
placeholderData: { ...storedFeed, items: storedFeed.items ?? [], loaded: false },
```

**Step 2: Run the E2E test to verify it passes**

```bash
yarn test:e2e e2e/localfirst.spec.ts
```
Expected: PASS

**Step 3: Verify build passes**

```bash
yarn build
```
Expected: `✓ built in ...`

**Step 4: Commit**

```bash
git add src/hooks/useFeedQuery.ts
git commit -m "feat: show cached items on load"
```

---

### Task 3: Persist fresh items to IndexedDB after fetch

**Files:**
- Modify: `src/hooks/useFeedQuery.ts`

**Step 1: Import `updateSiteFeed`**

Add to the imports at the top of `src/hooks/useFeedQuery.ts`:
```ts
import { updateSiteFeed } from "../services/indexeddbService";
```

**Step 2: Call `updateSiteFeed` in `queryFn`**

After building the feed object in `queryFn`, persist it before returning. Change the `queryFn` from:
```ts
queryFn: async ({ queryKey }): Promise<Feed> => {
  const parsedFeed = await rssParser.parseURL(feedUrl);
  const favicon = await getFavicon(parsedFeed.link);
  const cached = queryClient.getQueryData<Feed>(queryKey as [string, string]);
  return {
    ...parsedFeed,
    url: feedUrl,
    favicon,
    visited: cached?.visited ?? storedFeed.visited ?? {},
    priority: storedFeed.priority,
    loaded: true,
  };
},
```
to:
```ts
queryFn: async ({ queryKey }): Promise<Feed> => {
  const parsedFeed = await rssParser.parseURL(feedUrl);
  const favicon = await getFavicon(parsedFeed.link);
  const cached = queryClient.getQueryData<Feed>(queryKey as [string, string]);
  const feed: Feed = {
    ...parsedFeed,
    url: feedUrl,
    favicon,
    visited: cached?.visited ?? storedFeed.visited ?? {},
    priority: storedFeed.priority,
    loaded: true,
  };
  await updateSiteFeed(feed);
  return feed;
},
```

**Step 3: Verify build passes**

```bash
yarn build
```
Expected: `✓ built in ...`

**Step 4: Commit**

```bash
git add src/hooks/useFeedQuery.ts
git commit -m "feat: persist fresh items to IndexedDB after fetch"
```
