import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import RSSParser from "rss-parser";
import {
  ExternalLink,
  FavoritePin,
  FavoritesList,
  Footer,
  Header,
  HeadMeta,
  NewFeedForm,
  NewItemsList,
  ProgressLoader,
  VisitedItemsList,
} from "../components";
import { Feed } from "../models";
import {
  deleteSiteFeed,
  getSiteFeed,
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
  }
}

type Tab = "feeds" | "favorites";

const rssParser = new RSSParser();

async function allStorage(): Promise<Record<string, Feed>> {
  await initDatabase();
  const siteFeeds = await getSiteFeeds();
  var archive: Record<string, Feed> = {};

  for (const siteFeed of siteFeeds) {
    archive[siteFeed.url] = siteFeed;
  }

  return archive;
}

type FeedArchiveType = Record<string, Feed>;

export default function Home() {
  const router = useRouter();
  const activeTab = (router.query.tab as Tab) || "feeds";

  const [highestPriority, setHighestPriority] = useState<number>(0);
  const [feedArchive, setFeedArchive] = useState<FeedArchiveType>({});
  const [loadedFeeds, setLoadedFeeds] = useState<{
    total: number;
    loaded: number;
  }>({ total: 0, loaded: 0 });

  const onTabChange = (tab: Tab) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab },
    });
  };

  const updateFeeds = useCallback(async () => {
    let highestPriority = 0;
    const storage = await allStorage();
    const feedsCount = Object.keys(storage).length;

    setFeedArchive(storage as FeedArchiveType);

    setLoadedFeeds((s) => ({ ...s, total: feedsCount }));

    for (const feedUrl of Object.keys(storage)) {
      if (feedUrl in feedArchive) {
        storage[feedUrl] = {
          ...feedArchive[feedUrl],
          visited: storage[feedUrl].visited,
          priority: storage[feedUrl].priority,
        };
        continue;
      }
      try {
        const feed = await rssParser.parseURL(feedUrl);
        const feedFavicon = await getFavicon(feed.link);
        const feedToUpdate: Feed = {
          ...feed,
          url: feedUrl,
          favicon: feedFavicon,
          visited: storage[feedUrl].visited || {},
          priority: storage[feedUrl].priority,
        };

        if (feedToUpdate.priority && feedToUpdate.priority > highestPriority) {
          highestPriority = feedToUpdate.priority;
        }

        storage[feedUrl] = feedToUpdate;
      } catch {
        console.error(`Could not update feed for ${feedUrl}`);
      }

      setLoadedFeeds((s) => ({
        ...s,
        loaded: s.loaded + 1,
      }));
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
        feed = await rssParser.parseURL(feedUrl);
      } catch {
        errors.push(feedUrl);
      }
      if (feed && !(await getSiteFeed(feedUrl))) {
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

  const isContentLoading = loadedFeeds.loaded !== loadedFeeds.total;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highestPriority, sortedArchive, feedArchive]
  );

  useEffect(() => {
    updateFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadedFeeds.loaded > loadedFeeds.total) {
      setLoadedFeeds({ ...loadedFeeds, loaded: loadedFeeds.total });
    }
  }, [loadedFeeds]);

  return (
    <>
      <HeadMeta />
      <Header />
      <main className={Styles.container}>
        <NewFeedForm onSubmit={onSubmit} />
        <div className={Styles.tabsList}>
          <button
            onClick={() => onTabChange("feeds")}
            disabled={activeTab === "feeds"}
          >
            Feeds
          </button>
          <button
            onClick={() => onTabChange("favorites")}
            disabled={activeTab === "favorites"}
          >
            Favorites
          </button>
        </div>
        {activeTab === "feeds" &&
          sortedArchive.map((feedUrl) => {
            const feed = feedArchive[feedUrl];
            const newItems = feed.items.filter(
              (item) => item.link && (!feed.visited || !feed.visited[item.link])
            );
            const vizitedItems = feed.items.filter(
              (item) => item.link && feed.visited && feed.visited[item.link]
            );
            return (
              <section key={feedUrl} className={Styles.feed}>
                <h3>
                  <FavoritePin feed={feed} onClick={onFavoriteClick} />
                  {feed.link ? (
                    <>
                      {feed.favicon && (
                        <Image
                          alt={feed.title || feedUrl}
                          src={feed.favicon}
                          width={16}
                          height={16}
                          unoptimized
                        />
                      )}
                      <ExternalLink link={feed.link} title={feed.title} />
                    </>
                  ) : (
                    feed.title || feedUrl
                  )}{" "}
                  {isContentLoading && (
                    <>
                    <span className={Styles.loader2}>⏳</span>
                    <span className={Styles.loader3}>🔄</span>
                    <span className={Styles.loader4}>🧠</span>
                    </>
                  )}
                  <button onClick={() => onRemoveClick(feedUrl, feed.title)}>
                    ❌
                  </button>
                  {isContentLoading && (
                    <>
                    <span className={Styles.loader1}></span>
                    <span className={Styles.loader5}></span>
                    </>
                  )}
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
                  visitedItems={vizitedItems}
                />
              </section>
            );
          })}
        {activeTab === "favorites" && <FavoritesList />}
      </main>
      <Footer />
    </>
  );
}
