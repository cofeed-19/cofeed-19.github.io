import { useCallback, useEffect, useState } from "react";
import RSSParser from "rss-parser";
import { Feed } from "../../models";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../../services/favoritesService";
import { FeedItem } from "../FeedItem/FeedItem";
import Styles from "./VisitedItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  visitedItems: RSSParser.Item[];
};

export function VisitedItemsList({ feed, feedUrl, visitedItems }: Props) {
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const checkFavorites = async () => {
      const states: Record<string, boolean> = {};
      for (const item of visitedItems) {
        if (item.link) {
          const favorite = await getFavorite(item.link);
          states[item.link] = !!favorite;
        }
      }
      setFavoriteStates(states);
    };
    checkFavorites();
  }, [visitedItems]);

  const handleFavoriteClick = useCallback(
    async (item: RSSParser.Item) => {
      if (!item.link) return;

      if (favoriteStates[item.link]) {
        if (confirm(`Remove "${item.title}" from favorites?`)) {
          await removeFavorite(item.link);
          setFavoriteStates((prev) => ({ ...prev, [item.link!]: false }));
        }
      } else {
        await addFavorite(item, feed);
        setFavoriteStates((prev) => ({ ...prev, [item.link!]: true }));
      }
    },
    [feed, favoriteStates]
  );

  return Object.keys(feed.visited || {}).length ? (
    <details className={Styles.container}>
      <summary>Visited from {feed?.title || feedUrl}</summary>
      <ul>
        {visitedItems?.map((item) =>
          item.link ? (
            <FeedItem
              key={item.link}
              item={item}
              feed={feed}
              onFavoriteClick={() => handleFavoriteClick(item)}
              isFavorited={favoriteStates[item.link]}
            />
          ) : null
        )}
      </ul>
    </details>
  ) : null;
}
