import { useCallback, useEffect, useState } from "react";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../services/favoritesService";

type UseFavoritesConfig = {
  feed: Feed;
  onRemove?: () => Promise<void>;
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
      const states: Record<string, boolean> = {};
      for (const item of items) {
        if (item.link) {
          const favorite = await getFavorite(item.link);
          states[item.link] = !!favorite;
        }
      }
      setFavoriteStates(states);
    };
    checkFavorites();
  }, [items]);

  const handleFavoriteClick = useCallback(
    async (item: RSSParser.Item) => {
      if (!item.link) return;

      if (favoriteStates[item.link]) {
        if (confirm(`Remove "${item.title}" from favorites?`)) {
          await removeFavorite(item.link);
          setFavoriteStates((prev) => ({ ...prev, [item.link!]: false }));
          if (config.onRemove) {
            await config.onRemove();
          }
        }
      } else {
        await addFavorite(item, config.feed);
        setFavoriteStates((prev) => ({ ...prev, [item.link!]: true }));
      }
    },
    [config.feed, config.onRemove, favoriteStates]
  );

  return {
    favoriteStates,
    handleFavoriteClick,
  };
}
