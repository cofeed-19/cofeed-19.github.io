import { ExternalLink, FavoritePin, NewItemsList, VisitedItemsList } from "../";
import { Feed } from "../../models";
import { useFeedQuery } from "../../hooks";
import Styles from "../../styles/index.module.css";

type Props = {
  feedUrl: string;
  storedFeed: Feed;
  onRemove: (feedUrl: string, feedTitle?: string) => void;
  onPin: (feed: Feed) => void;
};

export function FeedSection({ feedUrl, storedFeed, onRemove, onPin }: Props) {
  const { data: feed = { ...storedFeed, items: [], loaded: false } } =
    useFeedQuery(feedUrl, storedFeed);

  const newItems = (feed.items ?? []).filter(
    (item) => item.link && (!feed.visited || !feed.visited[item.link.trim()])
  );
  const visitedItems = (feed.items ?? []).filter(
    (item) => item.link && feed.visited && feed.visited[item.link.trim()]
  );

  return (
    <section className={Styles.feed}>
      <h3>
        <FavoritePin feed={storedFeed} onClick={onPin} />
        {feed.link ? (
          <>
            {feed.favicon && (
              <img
                alt={feed.title || feedUrl}
                src={feed.favicon}
                width={16}
                height={16}
              />
            )}
            <ExternalLink link={feed.link} title={feed.title} />
          </>
        ) : (
          feed.title || feedUrl
        )}{" "}
        {!feed.loaded && <span className={Styles.bounceLoader}></span>}
        <button onClick={() => onRemove(feedUrl, feed.title)}>❌</button>
      </h3>
      <NewItemsList
        feed={feed}
        feedUrl={feedUrl}
        newItems={newItems}
        updateFeeds={() => Promise.resolve()}
      />
      <VisitedItemsList feed={feed} feedUrl={feedUrl} visitedItems={visitedItems} />
    </section>
  );
}
