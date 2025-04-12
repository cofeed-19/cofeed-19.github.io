import { useCallback, useEffect, useState } from "react";
import RSSParser from "rss-parser";
import { Feed } from "../../models";
import { addFavorite, getFavorite } from "../../services/favoritesService";
import { getSiteFeed, updateSiteFeed } from "../../services/indexeddbService";
import { FeedItem } from "../FeedItem/FeedItem";
import Styles from "./NewItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  newItems: RSSParser.Item[];
  updateFeeds(): Promise<void>;
};

const onLinkClick = async (feedUrl?: string, itemLink?: string) => {
  if (!feedUrl || !itemLink) {
    return;
  }

  const siteFeed = await getSiteFeed(feedUrl);
  if (siteFeed.visited) {
    siteFeed.visited[itemLink] = true;
  }

  await updateSiteFeed(siteFeed);
};

const markAllAsVisited = async (feedUrl: string, itemLinks: string[]) => {
  if (!feedUrl || !itemLinks.length) {
    return;
  }

  const siteFeed = await getSiteFeed(feedUrl);
  if (siteFeed.visited) {
    for (const itemLink of itemLinks) {
      siteFeed.visited[itemLink] = true;
    }
  }

  await updateSiteFeed(siteFeed);
};

export function NewItemsList(props: Props) {
  const { feed, feedUrl, newItems, updateFeeds } = props;
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const checkFavorites = async () => {
      const states: Record<string, boolean> = {};
      for (const item of newItems) {
        if (item.link) {
          const favorite = await getFavorite(item.link);
          states[item.link] = !!favorite;
        }
      }
      setFavoriteStates(states);
    };
    checkFavorites();
  }, [newItems]);

  const handleFavoriteClick = useCallback(
    async (item: RSSParser.Item) => {
      if (!item.link) return;
      await addFavorite(item, feed);
      setFavoriteStates((prev) => ({ ...prev, [item.link!]: true }));
    },
    [feed]
  );

  return (
    <>
      <ul className={Styles.list}>
        {newItems?.map((item) =>
          item.link ? (
            <FeedItem
              key={item.link}
              item={item}
              feed={feed}
              onClick={() => onLinkClick(feedUrl, item.link)}
              onFavoriteClick={() => handleFavoriteClick(item)}
              isFavorited={favoriteStates[item.link]}
            />
          ) : null
        )}
      </ul>
      {newItems.length ? (
        <button
          onClick={() => {
            if (confirm(`Mark all ${feed?.title || feedUrl} as visited?`)) {
              markAllAsVisited(
                feedUrl,
                newItems.map((item) => item.link || "").filter(Boolean)
              ).then(() => updateFeeds());
            }
          }}
        >
          Mark all as visited
        </button>
      ) : null}
    </>
  );
}
