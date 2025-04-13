import RSSParser from "rss-parser";
import { useFavorites } from "../../hooks/useFavorites";
import { Feed } from "../../models";
import { FeedItem } from "../FeedItem/FeedItem";
import Styles from "./VisitedItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  visitedItems: RSSParser.Item[];
};

export function VisitedItemsList({ feed, feedUrl, visitedItems }: Props) {
  const { favoriteStates, handleFavoriteClick } = useFavorites(visitedItems, {
    feed,
  });

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
