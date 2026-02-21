# TanStack Query Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace manual useState + direct IndexedDB service calls in `Home.tsx` with TanStack Query for caching, automatic refetching, and loading state management.

**Architecture:** Install `@tanstack/react-query`, wrap the app in `QueryClientProvider`, extract all data fetching into hooks using `useQuery`/`useMutation`. Each feed URL gets its own `useQuery` via a `useFeedQuery` hook so feeds load in parallel and each renders its own loading state independently. A `useFeeds` hook manages the list (stored URLs + mutations). A separate `useFavorites` refactor brings favorites in line with the same pattern.

**Tech Stack:** `@tanstack/react-query` v5, React 18, IndexedDB via `idb`, `rss-parser`

---

### Task 1: Install TanStack Query

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

```bash
yarn add @tanstack/react-query
```

**Step 2: Verify install**

```bash
grep "@tanstack/react-query" package.json
```
Expected: `"@tanstack/react-query": "^5.x.x"`

**Step 3: Commit**

```bash
git add package.json yarn.lock .yarn/install-state.gz
git commit -m "install @tanstack/react-query"
```

---

### Task 2: Add QueryClientProvider to App

**Files:**
- Modify: `src/App.tsx`

**Step 1: Read current App.tsx**

```bash
cat src/App.tsx
```

**Step 2: Wrap app in QueryClientProvider**

Add to `src/App.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Wrap the existing app root with:
<QueryClientProvider client={queryClient}>
  {/* existing JSX */}
</QueryClientProvider>
```

**Step 3: Run dev server to verify no errors**

```bash
yarn dev
```
Expected: App loads without console errors.

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "add QueryClientProvider to app root"
```

---

### Task 3: Create useFeeds and useFeedQuery hooks

**Files:**
- Create: `src/hooks/useFeeds.ts`
- Create: `src/hooks/useFeedQuery.ts`
- Modify: `src/hooks/index.ts`

**Context:** Two hooks with distinct responsibilities:
- `useFeeds` — manages the list of stored feed URLs + mutations (add, remove, pin)
- `useFeedQuery(feedUrl, storedFeed)` — fetches and caches a single feed's RSS data; called per feed in the render loop so each feed is an independent query with its own loading state

**Step 1: Create `src/hooks/useFeeds.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import {
  deleteSiteFeed,
  getSiteFeeds,
  insertSiteFeed,
  updateSiteFeed,
} from "../services/indexeddbService";
import { getFavicon } from "../utils";

const rssParser = new RSSParser();

export function useFeeds() {
  const queryClient = useQueryClient();

  const { data: storedFeeds = [] } = useQuery({
    queryKey: ["feeds"],
    queryFn: getSiteFeeds,
  });

  const highestPriority = Math.max(0, ...storedFeeds.map((f) => f.priority ?? 0));

  const addFeedMutation = useMutation({
    mutationFn: async (feedUrls: string[]) => {
      const errors: string[] = [];
      for (const feedUrl of feedUrls) {
        try {
          const feed = await rssParser.parseURL(feedUrl);
          const favicon = await getFavicon(feed.link);
          await insertSiteFeed({ url: feedUrl, visited: {}, favicon, priority: 0, ...feed });
        } catch {
          errors.push(feedUrl);
        }
      }
      if (errors.length) {
        throw new Error(
          `Could not add:\n${errors.join("\n")}\n\nProbable CORS issue😢!\nMaybe ask website owner to enable CORS🤔!\nOr install browser extension to allow CORS: https://mybrowseraddon.com/access-control-allow-origin.html`
        );
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feeds"] }),
  });

  const removeFeedMutation = useMutation({
    mutationFn: deleteSiteFeed,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feeds"] }),
  });

  const pinFeed = async (feed: Feed) => {
    const allFeeds = storedFeeds.map((f) => ({
      ...f,
      priority: f.url === feed.url
        ? (feed.priority ? undefined : highestPriority + 1)
        : f.priority,
    }));

    allFeeds.sort((a, b) => {
      if (a.priority && b.priority) return a.priority - b.priority;
      if (a.priority) return -1;
      if (b.priority) return 1;
      return 0;
    });

    const reordered = allFeeds.map((f, i) => ({
      ...f,
      priority: f.priority ? i + 1 : undefined,
    }));

    for (const f of reordered) {
      await updateSiteFeed(f as Feed);
    }
    queryClient.invalidateQueries({ queryKey: ["feeds"] });
  };

  return {
    storedFeeds,
    addFeed: addFeedMutation.mutateAsync,
    removeFeed: removeFeedMutation.mutateAsync,
    pinFeed,
    isAddingFeed: addFeedMutation.isPending,
    addFeedError: addFeedMutation.error?.message,
  };
}
```

**Step 2: Create `src/hooks/useFeedQuery.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import { getFavicon } from "../utils";

const rssParser = new RSSParser();

export function useFeedQuery(feedUrl: string, storedFeed: Feed) {
  return useQuery({
    queryKey: ["feed", feedUrl],
    queryFn: async (): Promise<Feed> => {
      const parsedFeed = await rssParser.parseURL(feedUrl);
      const favicon = await getFavicon(parsedFeed.link);
      return {
        ...parsedFeed,
        url: feedUrl,
        favicon,
        visited: storedFeed.visited || {},
        priority: storedFeed.priority,
        loaded: true,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    // Keep previous data while refetching so UI doesn't flash
    placeholderData: { ...storedFeed, items: [], loaded: false },
  });
}
```

**Step 3: Export both from hooks index**

Add to `src/hooks/index.ts`:
```ts
export * from "./useFeeds";
export * from "./useFeedQuery";
```

**Step 4: Verify TypeScript compiles**

```bash
yarn build 2>&1 | head -30
```
Expected: No type errors.

**Step 5: Commit**

```bash
git add src/hooks/useFeeds.ts src/hooks/useFeedQuery.ts src/hooks/index.ts
git commit -m "add useFeeds and useFeedQuery hooks with TanStack Query"
```

---

### Task 4: Refactor Home.tsx to use useFeeds + extract FeedSection component

**Files:**
- Modify: `src/pages/Home.tsx`
- Create: `src/components/FeedSection/FeedSection.tsx`

**Context:** Each feed needs to call `useFeedQuery` — but hooks can't be called inside `.map()`. So extract a `FeedSection` component that receives `feedUrl` + `storedFeed` as props and calls `useFeedQuery` at the top level of that component. This is the standard React pattern for per-item hooks.

**Step 1: Create `src/components/FeedSection/FeedSection.tsx`**

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FavoritePin, NewItemsList, VisitedItemsList } from "../";
import { Feed } from "../../models";
import { useFeedQuery } from "../../hooks";
import Styles from "../../styles/index.module.css";

type Props = {
  feedUrl: string;
  storedFeed: Feed;
  onRemove: (feedUrl: string, feedTitle?: string) => void;
  onPin: (feed: Feed) => void;
};

export function FeedSection({ feedUrl, storedFeed, onRemove, onPin }: Props) {
  const { data: feed = { ...storedFeed, items: [], loaded: false } } = useFeedQuery(feedUrl, storedFeed);

  const newItems = (feed.items ?? []).filter(
    (item) => item.link && (!feed.visited || !feed.visited[item.link.trim()])
  );
  const visitedItems = (feed.items ?? []).filter(
    (item) => item.link && feed.visited && feed.visited[item.link.trim()]
  );

  return (
    <section className={Styles.feed}>
      <h3>
        <FavoritePin feed={storedFeed} onClick={onPin} />
        {feed.link ? (
          <>
            {feed.favicon && (
              <img alt={feed.title || feedUrl} src={feed.favicon} width={16} height={16} />
            )}
            <ExternalLink link={feed.link} title={feed.title} />
          </>
        ) : (
          feed.title || feedUrl
        )}{" "}
        {!feed.loaded && <span className={Styles.bounceLoader}></span>}
        <button onClick={() => onRemove(feedUrl, feed.title)}>❌</button>
      </h3>
      <NewItemsList
        feed={feed}
        feedUrl={feedUrl}
        newItems={newItems}
        updateFeeds={() => Promise.resolve()}
      />
      <VisitedItemsList feed={feed} feedUrl={feedUrl} visitedItems={visitedItems} />
    </section>
  );
}
```

**Step 2: Export FeedSection from components index**

Add to `src/components/index.ts`:
```ts
export * from "./FeedSection/FeedSection";
```

**Step 3: Replace Home.tsx**

```tsx
import { useState } from "react";
import { FavoritesList, FeedSection, NewFeedForm } from "../components";
import { useFeeds } from "../hooks";
import Styles from "../styles/index.module.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"feeds" | "favorites">("feeds");
  const { storedFeeds, addFeed, removeFeed, pinFeed } = useFeeds();

  async function onSubmit(newFeed: string) {
    const feedUrls = newFeed.trim().split(",").filter(Boolean);
    try {
      await addFeed(feedUrls);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function onRemoveClick(feedUrl: string, feedTitle?: string) {
    if (confirm(`Delete ${feedTitle} from feeds?`)) {
      removeFeed(feedUrl);
    }
  }

  const sortedFeeds = storedFeeds
    .slice()
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return (
    <div className={Styles.container}>
      <NewFeedForm onSubmit={onSubmit} />
      <div className={Styles.tabsList}>
        <button onClick={() => setActiveTab("feeds")} disabled={activeTab === "feeds"}>
          Feeds
        </button>
        <button onClick={() => setActiveTab("favorites")} disabled={activeTab === "favorites"}>
          Favorites
        </button>
      </div>
      {activeTab === "feeds" &&
        sortedFeeds.map((storedFeed) => (
          <FeedSection
            key={storedFeed.url}
            feedUrl={storedFeed.url}
            storedFeed={storedFeed}
            onRemove={onRemoveClick}
            onPin={pinFeed}
          />
        ))}
      {activeTab === "favorites" && <FavoritesList />}
    </div>
  );
}
```

**Step 4: Run dev server and verify**

```bash
yarn dev
```
Open browser — each feed should appear and load independently (you'll see the bounce loader per feed until its RSS fetch completes).

**Step 5: Commit**

```bash
git add src/pages/Home.tsx src/components/FeedSection/FeedSection.tsx src/components/index.ts
git commit -m "refactor Home.tsx: per-feed useQuery via FeedSection component"
```

---

### Task 5: Update NewItemsList to invalidate query on visited click

**Files:**
- Modify: `src/components/NewItemsList/NewItemsList.tsx`

**Context:** `NewItemsList` currently calls `updateFeeds()` after marking an item visited (to trigger a re-render). With TanStack Query, we should invalidate `["feeds"]` directly instead of passing a callback prop.

**Step 1: Update NewItemsList**

Replace the `updateFeeds` prop with query invalidation:

```tsx
import { useQueryClient } from "@tanstack/react-query";
import RSSParser from "rss-parser";
import { useFavorites } from "../../hooks";
import { Feed } from "../../models";
import { getSiteFeed, updateSiteFeed } from "../../services/indexeddbService";
import { FeedItem } from "../FeedItem/FeedItem";
import Styles from "./NewItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  newItems: RSSParser.Item[];
  updateFeeds(): Promise<void>; // kept for backwards compat, unused
};

export function NewItemsList(props: Props) {
  const { feed, feedUrl, newItems } = props;
  const queryClient = useQueryClient();
  const { favoriteStates, toggleFavorite } = useFavorites(newItems, { feed });

  const onLinkClick = async (itemLink?: string) => {
    if (!feedUrl || !itemLink) return;
    const siteFeed = await getSiteFeed(feedUrl);
    if (siteFeed.visited) {
      siteFeed.visited[itemLink] = true;
    }
    await updateSiteFeed(siteFeed);
    queryClient.invalidateQueries({ queryKey: ["feeds"] });
  };

  const markAllAsVisited = async () => {
    if (!newItems.length) return;
    if (!confirm(`Mark all ${feed?.title || feedUrl} as visited?`)) return;
    const siteFeed = await getSiteFeed(feedUrl);
    if (siteFeed.visited) {
      for (const item of newItems) {
        if (item.link) siteFeed.visited[item.link] = true;
      }
    }
    await updateSiteFeed(siteFeed);
    queryClient.invalidateQueries({ queryKey: ["feeds"] });
  };

  return (
    <>
      <ul className={Styles.list}>
        {newItems?.map((item) =>
          item.link ? (
            <FeedItem
              key={item.link}
              item={item}
              feed={feed}
              onClick={() => onLinkClick(item.link)}
              onFavoriteClick={() => toggleFavorite(item)}
              isFavorited={favoriteStates[item.link]}
              testId="new-item"
            />
          ) : null
        )}
      </ul>
      {newItems.length ? (
        <button onClick={markAllAsVisited}>Mark all as visited</button>
      ) : null}
    </>
  );
}
```

**Step 2: Verify dev server still works**

```bash
yarn dev
```
Click a feed item link, verify it moves to visited section.

**Step 3: Run e2e tests to confirm nothing broken**

```bash
yarn test:e2e
```
Expected: All 17 tests pass.

**Step 4: Commit**

```bash
git add src/components/NewItemsList/NewItemsList.tsx
git commit -m "use queryClient.invalidateQueries in NewItemsList"
```

---

### Task 6: Update useFavorites to use TanStack Query

**Files:**
- Modify: `src/hooks/useFavorites.ts`

**Context:** `useFavorites` currently loads favorites manually via `useEffect` + `useState`. Replace with `useQuery` for the fetch and `useMutation` for toggle.

**Step 1: Rewrite useFavorites.ts**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/favoritesService";

type UseFavoritesConfig = {
  feed: Feed;
};

export function useFavorites(
  items: RSSParser.Item[],
  config: UseFavoritesConfig
) {
  const queryClient = useQueryClient();

  const { data: allFavorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const favoriteUrls = new Set(allFavorites.map((f) => f.url));
  const favoriteStates: Record<string, boolean> = {};
  for (const item of items) {
    if (item.link) {
      favoriteStates[item.link] = favoriteUrls.has(item.link);
    }
  }

  const toggleMutation = useMutation({
    mutationFn: async (item: RSSParser.Item) => {
      if (!item.link) return;
      if (favoriteStates[item.link]) {
        if (confirm(`Remove "${item.title}" from favorites?`)) {
          await removeFavorite(item.link);
        }
      } else {
        await addFavorite(item, config.feed);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return {
    favoriteStates,
    toggleFavorite: toggleMutation.mutate,
  };
}
```

**Step 2: Update FavoritesList to use useQuery**

Modify `src/components/FavoritesList/FavoritesList.tsx` — replace `useEffect`/`useState`/`loadFavorites` with:

```tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Favorite } from "../../models";
import { getFavorites, removeFavorite } from "../../services/favoritesService";
import { DateComponent } from "../Date/Date";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import Styles from "./FavoritesList.module.css";

export function FavoritesList() {
  const queryClient = useQueryClient();

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    select: (favs) => [...favs].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)),
  });

  const removeMutation = useMutation({
    mutationFn: async (favorite: Favorite) => {
      if (favorite.link && confirm(`Remove "${favorite.title}" from favorites?`)) {
        await removeFavorite(favorite.link);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return (
    <div className={Styles.container}>
      <h2>Favorites</h2>
      <ul className={Styles.list}>
        {favorites.map((favorite) => (
          <li key={favorite.url} className={Styles.item}>
            <DateComponent date={favorite.pubDate} />
            <div>
              <ExternalLink
                title={favorite.title || favorite.link || ""}
                link={favorite.link || ""}
              />
              <button
                onClick={() => removeMutation.mutate(favorite)}
                className={Styles.removeButton}
                title="Remove from favorites"
              >
                ❌
              </button>
              <div className={Styles.source}>
                from{" "}
                <ExternalLink
                  title={favorite.sourceFeedTitle}
                  link={favorite.sourceFeedUrl || ""}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 3: Run e2e tests**

```bash
yarn test:e2e
```
Expected: All 17 tests pass.

**Step 4: Commit**

```bash
git add src/hooks/useFavorites.ts src/components/FavoritesList/FavoritesList.tsx
git commit -m "refactor useFavorites and FavoritesList to use TanStack Query"
```

---

### Task 7: Clean up dead code

**Files:**
- Modify: `src/pages/Home.tsx` — remove unused `updateFeeds` prop passing
- Modify: `src/components/NewItemsList/NewItemsList.tsx` — remove `updateFeeds` prop entirely
- Delete if empty: `src/pages/Home.tsx` `window.rssParser` global declaration (no longer needed)

**Step 1: Remove `updateFeeds` prop from NewItemsList type and Home.tsx**

In `NewItemsList.tsx`, remove `updateFeeds` from the `Props` type and destructuring.

In `Home.tsx`, remove `updateFeeds={() => Promise.resolve()}` from `<NewItemsList>`.

**Step 2: TypeScript check**

```bash
yarn build 2>&1 | grep -i error
```
Expected: No errors.

**Step 3: Run e2e tests**

```bash
yarn test:e2e
```
Expected: All 17 tests pass.

**Step 4: Commit**

```bash
git add src/pages/Home.tsx src/components/NewItemsList/NewItemsList.tsx
git commit -m "remove updateFeeds prop, clean up dead code"
```

---

## Verification

After all tasks:

1. `yarn build` — no TypeScript errors
2. `yarn test:e2e` — all 17 tests pass
3. Manual smoke test:
   - Add a feed → appears with items
   - Click item → moves to visited
   - Reload → visited state persists
   - Pin feed → reorders to top
   - Add to favorites → appears in Favorites tab
   - Export → JSON file downloads
   - Import → feeds restored

## Notes

- **Query keys:** `["feeds"]` for stored feed list, `["feed", feedUrl]` per individual RSS feed, `["favorites"]` for favorites
- **Per-feed queries:** Each `FeedSection` calls `useFeedQuery(feedUrl)` — independent cache entry, loading state, and refetch timer per feed
- **staleTime 5min / refetchInterval 15min** — feeds auto-refresh every 15 minutes, cached for 5
- **No breaking changes to models or services** — only hook and component layer changes
- **`updateFeeds` prop** is kept temporarily in Task 5 (backwards compat) then removed in Task 7
- **Why FeedSection component:** hooks can't be called inside `.map()` — extracting to a component lets each feed call `useFeedQuery` at the top level
