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
