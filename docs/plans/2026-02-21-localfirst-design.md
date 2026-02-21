# Local-First Feed Loading

## Problem

On page load, users see feed titles but no articles until the RSS fetch completes. IndexedDB stores `items` from the last fetch but `useFeedQuery` discards them with `items: []` in `placeholderData`.

## Solution

Two changes to `useFeedQuery.ts`:

1. **Show cached items immediately** — change `placeholderData` to use `storedFeed.items ?? []` so users see last-fetched articles instantly while the network fetch runs in the background. The existing `loaded: false` flag keeps the spinner visible.

2. **Persist fresh items to IndexedDB** — after a successful RSS fetch, call `updateSiteFeed` with the full feed (including new `items`) so the cache stays current across sessions.

## Non-goals

- Benchmarking UX improvement
- Staleness tracking / `initialData` approach
