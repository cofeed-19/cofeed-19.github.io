# Local-First Feed Loading Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show cached feed items instantly on page load, then update with fresh data from RSS fetch in the background.

**Architecture:** Two changes to `useFeedQuery.ts`: (1) pass `storedFeed.items` as placeholder data so cached items render immediately, (2) call `updateSiteFeed` after a successful fetch to persist fresh items back to IndexedDB for future sessions.

**Tech Stack:** React, TanStack Query (`useQuery`), IndexedDB via `idb`, `rss-parser`

---

### Task 1: Show cached items as placeholder data

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

**Step 2: Verify build passes**

```bash
yarn build
```
Expected: `✓ built in ...`

**Step 3: Commit**

```bash
git add src/hooks/useFeedQuery.ts
git commit -m "feat: show cached items on load"
```

---

### Task 2: Persist fresh items to IndexedDB after fetch

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
