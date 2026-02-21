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
  const { feed, feedUrl, newItems } = props;
  const queryClient = useQueryClient();
  const { favoriteStates, toggleFavorite } = useFavorites(newItems, {
    feed,
  });

  const markVisitedInCache = (links: string[]) => {
    queryClient.setQueryData<Feed>(["feed", feedUrl], (old) => {
      if (!old) return old;
      const visited = { ...(old.visited ?? {}) };
      for (const link of links) {
        visited[link] = true;
      }
      return { ...old, visited };
    });
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
              onClick={() =>
                onLinkClick(feedUrl, item.link).then(() =>
                  markVisitedInCache([item.link!])
                )
              }
              onFavoriteClick={() => toggleFavorite(item)}
              isFavorited={favoriteStates[item.link]}
              testId="new-item"
            />
          ) : null
        )}
      </ul>
      {newItems.length ? (
        <button
          onClick={() => {
            if (confirm(`Mark all ${feed?.title || feedUrl} as visited?`)) {
              const links = newItems
                .map((item) => item.link || "")
                .filter(Boolean);
              markAllAsVisited(feedUrl, links).then(() =>
                markVisitedInCache(links)
              );
            }
          }}
        >
          Mark all as visited
        </button>
      ) : null}
    </>
  );
}
