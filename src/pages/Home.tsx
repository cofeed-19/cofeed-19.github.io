import { useCallback, useEffect, useMemo, useState } from "react";
import RSSParser from "rss-parser";
import {
  ExternalLink,
  FavoritePin,
  FavoritesList,
  NewFeedForm,
  NewItemsList,
  VisitedItemsList,
} from "../components";
import { Feed } from "../models";
import {
  deleteSiteFeed,
  getSiteFeeds,
  initDatabase,
  insertSiteFeed,
  updateSiteFeed,
} from "../services/indexeddbService";
import Styles from "../styles/index.module.css";
import { getFavicon } from "../utils";

declare global {
  interface Window {
    dbPromise: Promise<boolean>;
    rssParser?: RSSParser;
  }
}

async function allStorage(): Promise<Record<string, Feed>> {
  await initDatabase();
  const siteFeeds = await getSiteFeeds();
  return siteFeeds.reduce(
    (acc, feed) => {
      acc[feed.url] = feed;
      return acc;
    },
    {} as Record<string, Feed>
  );
}

type FeedArchiveType = Record<string, Feed>;

export default function HomePage() {
  const [highestPriority, setHighestPriority] = useState<number>(0);
  const [feedArchive, setFeedArchive] = useState<FeedArchiveType>({});

  const updateFeeds = useCallback(async () => {
    let highestPriority = 0;
    const storage = await allStorage();

    setFeedArchive(storage as FeedArchiveType);

    for (const feedUrl of Object.keys(storage)) {
      if (feedUrl in feedArchive) {
        storage[feedUrl] = {
          ...feedArchive[feedUrl],
          visited: storage[feedUrl].visited,
          priority: storage[feedUrl].priority,
          loaded: false,
        };
        continue;
      }
      try {
        if (!window.rssParser) {
          window.rssParser = new RSSParser();
        }
        const feed = await window.rssParser.parseURL(feedUrl);
        const feedFavicon = await getFavicon(feed.link);
        const feedToUpdate: Feed = {
          ...feed,
          url: feedUrl,
          favicon: feedFavicon,
          visited: storage[feedUrl].visited || {},
          priority: storage[feedUrl].priority,
          loaded: true,
        };

        if (feedToUpdate.priority && feedToUpdate.priority > highestPriority) {
          highestPriority = feedToUpdate.priority;
        }

        storage[feedUrl] = feedToUpdate;
        setFeedArchive({ ...storage });
      } catch {
        console.error(`Could not update feed for ${feedUrl}`);
      }
    }

    setHighestPriority(highestPriority);
    setFeedArchive(storage as FeedArchiveType);
  }, [feedArchive]);

  async function onSubmit(newFeed: string): Promise<void> {
    const newFeeds = newFeed.trim().split(",").filter(Boolean);

    const errors = [];

    for (const feedUrl of newFeeds) {
      let feed;
      try {
        if (!window.rssParser) {
          window.rssParser = new RSSParser();
        }
        feed = await window.rssParser.parseURL(feedUrl);
      } catch {
        errors.push(feedUrl);
      }
      if (feed && !(await getSiteFeeds()).some((f) => f.url === feedUrl)) {
        const feedFavicon = await getFavicon(feed.link);
        await insertSiteFeed({
          url: feedUrl,
          visited: {},
          favicon: feedFavicon,
          priority: 0,
          ...feed,
        });
      }
    }
    if (errors.length) {
      alert(
        `Could not add:\n${errors.join(
          "\n"
        )}\n\nProbable CORS issue😢!\nMaybe ask website owner to enable CORS🤔!\nOr install browser extension to allow CORS: https://mybrowseraddon.com/access-control-allow-origin.html`
      );
    }

    updateFeeds();
  }

  function onRemoveClick(feedUrl: string, feedTitle?: string) {
    if (confirm(`Delete ${feedTitle} from feeds?`)) {
      deleteSiteFeed(feedUrl);
      updateFeeds();
    }
  }

  const sortedArchive = useMemo(() => {
    const keys = Object.keys(feedArchive);

    keys.sort((a, b) => {
      const feedA = feedArchive[a];
      const feedB = feedArchive[b];

      const feedAPriority = feedA.priority ?? 0;
      const feedBPriority = feedB.priority ?? 0;

      if (feedAPriority > feedBPriority) {
        return -1;
      }
      if (feedAPriority < feedBPriority) {
        return 1;
      }

      return 0;
    });

    return keys;
  }, [feedArchive]);

  const onFavoriteClick = useCallback(
    async (feed: Feed) => {
      const resortedArchive = sortedArchive
        .map((k) => feedArchive[k])
        .map((f) => {
          if (f.url === feed.url) {
            return {
              ...f,
              priority: feed.priority ? undefined : highestPriority + 1,
            };
          }
          return f;
        });

      resortedArchive.sort((a, b) => {
        if (a.priority && b.priority) {
          return a.priority - b.priority;
        }
        if (a.priority) {
          return -1;
        }
        if (b.priority) {
          return 1;
        }
        return 0;
      });

      const updatedArchive = resortedArchive.map((feed, index) => {
        if (feed.priority) {
          return {
            ...feed,
            priority: index + 1,
          };
        }
        return feed;
      });

      for (const feed of updatedArchive) {
        await updateSiteFeed(feed);
      }

      setHighestPriority(updatedArchive.length);

      updateFeeds();
    },
    [highestPriority, sortedArchive, feedArchive]
  );

  useEffect(() => {
    updateFeeds();
  }, []);

  return (
    <div className={Styles.container}>
      <NewFeedForm onSubmit={onSubmit} />
      {sortedArchive.map((feedUrl) => {
        const feed = feedArchive[feedUrl];
        const newItems = feed.items.filter(
          (item) =>
            item.link &&
            (!feed.visited || !feed.visited[item.link.trim()])
        );
        const visitedItems = feed.items.filter(
          (item) =>
            item.link && feed.visited && feed.visited[item.link.trim()]
        );
        return (
          <section key={feedUrl} className={Styles.feed}>
            <h3>
              <FavoritePin feed={feed} onClick={onFavoriteClick} />
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
              {!feed.loaded && (
                <>
                  <span className={Styles.bounceLoader}></span>
                </>
              )}
              <button onClick={() => onRemoveClick(feedUrl, feed.title)}>
                ❌
              </button>
            </h3>
            <NewItemsList
              feed={feed}
              feedUrl={feedUrl}
              newItems={newItems}
              updateFeeds={updateFeeds}
            />
            <VisitedItemsList
              feed={feed}
              feedUrl={feedUrl}
              visitedItems={visitedItems}
            />
          </section>
        );
      })}
    </div>
  );
}
