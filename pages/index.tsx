import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import RSSParser from "rss-parser";
import {
  ExternalLink,
  Footer,
  Header,
  HeadMeta,
  NewFeedForm,
  NewItemsList,
  ProgressLoader,
  VisitedItemsList,
} from "../components";
import { FavoritePin } from "../components/FavoritePin";
import { Feed, SiteFeed } from "../models";
import {
  deleteSiteFeed,
  getSiteFeed,
  getSiteFeeds,
  initDatabase,
  insertSiteFeed,
  updateSiteFeed,
} from "../services/indexeddbService";
import { getFavicon } from "../utils";

declare global {
  interface Window {
    dbPromise: Promise<boolean>;
  }
}

const rssParser = new RSSParser();

async function allStorage(): Promise<Record<string, SiteFeed>> {
  await initDatabase();
  const siteFeeds = await getSiteFeeds();
  const archive: Record<string, SiteFeed> = {};

  for (const siteFeed of siteFeeds) {
    archive[siteFeed.url] = siteFeed;
  }

  return archive;
}

type FeedArchiveType = Record<string, Feed>;

export default function Home() {
  const [feedArchive, setFeedArchive] = useState<FeedArchiveType>({});
  const [loadedFeeds, setLoadedFeeds] = useState<{
    total: number;
    loaded: number;
  }>({ total: 0, loaded: 0 });

  async function updateFeeds() {
    const storage = await allStorage();
    const feedsCount = Object.keys(storage).length;

    setLoadedFeeds((s) => ({ ...s, total: feedsCount }));
    for (const feedUrl of Object.keys(storage)) {
      try {
        const feed = await rssParser.parseURL(feedUrl);
        const feedFavicon = await getFavicon(feed.link);
        const feedToUpdate: Feed = {
          ...feed,
          url: feedUrl,
          favicon: feedFavicon,
          visited: storage[feedUrl].visited || {},
          favorite: storage[feedUrl].favorite || false,
        };
        storage[feedUrl] = feedToUpdate;
      } catch (_e) {
        console.error(`Could not update feed for ${feedUrl}`);
      }
      setLoadedFeeds((s) => ({
        ...s,
        loaded: s.loaded + 1,
      }));
    }

    setFeedArchive(storage as FeedArchiveType);
  }

  async function onSubmit(newFeed: string): Promise<void> {
    const newFeeds = newFeed.trim().split(",").filter(Boolean);

    const errors = [];

    for (const feedUrl of newFeeds) {
      let feed;
      try {
        feed = await rssParser.parseURL(feedUrl);
      } catch (_e) {
        errors.push(feedUrl);
      }
      if (feed && !(await getSiteFeed(feedUrl))) {
        await insertSiteFeed({ url: feedUrl, visited: {} });
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

  const onFavoriteClick = useCallback(async (feed: Feed) => {
    await updateSiteFeed({ ...feed, favorite: !feed.favorite });
    updateFeeds();
  }, []);

  useEffect(() => {
    updateFeeds();
  }, []);

  useEffect(() => {
    if (loadedFeeds.loaded > loadedFeeds.total) {
      setLoadedFeeds({ ...loadedFeeds, loaded: loadedFeeds.total });
    }
  }, [loadedFeeds]);

  const sortedArchive = useMemo(() => {
    const keys = Object.keys(feedArchive);

    keys.sort((a, b) => {
      if (feedArchive[a].favorite && !feedArchive[b].favorite) {
        return -1;
      }
      if (!feedArchive[a].favorite && feedArchive[b].favorite) {
        return 1;
      }
      return 0;
    });

    return keys;
  }, [feedArchive]);

  return (
    <>
      <HeadMeta />
      <Header />
      <main>
        <NewFeedForm onSubmit={onSubmit} />
        <ProgressLoader loadedFeeds={loadedFeeds} />
        {sortedArchive.map((feedUrl) => {
          const feed = feedArchive[feedUrl];
          const newItems = feed.items.filter(
            (item) => item.link && (!feed.visited || !feed.visited[item.link])
          );
          const vizitedItems = feed.items.filter(
            (item) => item.link && feed.visited && feed.visited[item.link]
          );
          return (
            <section key={feedUrl}>
              <h3>
                <FavoritePin feed={feed} onClick={onFavoriteClick} />
                {feed.link ? (
                  <>
                    {feed.favicon && (
                      <Image
                        alt={feed.title}
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
                visitedItems={vizitedItems}
              />
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
