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
