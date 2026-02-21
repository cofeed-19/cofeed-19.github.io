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
    placeholderData: { ...storedFeed, items: [], loaded: false },
  });
}
