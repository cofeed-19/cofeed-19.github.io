import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Feed } from "../models";
import { rssParser } from "../lib/rssParser";
import { getFavicon } from "../utils";

export function useFeedQuery(feedUrl: string, storedFeed: Feed) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["feed", feedUrl],
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
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    placeholderData: { ...storedFeed, items: [], loaded: false },
  });
}
