import { useCallback, useEffect, useState } from "react";
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
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const checkFavorites = async () => {
      const allFavorites = await getFavorites();
      const favoriteUrls = new Set(allFavorites.map((fav) => fav.url));

      const states: Record<string, boolean> = {};
      for (const item of items) {
        if (item.link) {
          states[item.link] = favoriteUrls.has(item.link);
        }
      }
      setFavoriteStates(states);
    };
    if (items && items.length > 0) {
      checkFavorites();
    } else {
      setFavoriteStates({});
    }
  }, [items]);

  const toggleFavorite = useCallback(
    async (item: RSSParser.Item) => {
      if (!item.link) return;

      const isFavorited = favoriteStates[item.link];

      if (isFavorited) {
        if (confirm(`Remove "${item.title}" from favorites?`)) {
          await removeFavorite(item.link);
          setFavoriteStates((prev) => ({ ...prev, [item.link!]: false }));
        }
      } else {
        await addFavorite(item, config.feed);
        setFavoriteStates((prev) => ({ ...prev, [item.link!]: true }));
      }
    },
    [config.feed, favoriteStates]
  );

  return {
    favoriteStates,
    toggleFavorite,
  };
}
