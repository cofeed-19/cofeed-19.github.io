import { useCallback, useEffect, useMemo, useState } from "react";
import RSSParser from "rss-parser";
import {
  FavoritesList,
  NewFeedForm,
  NewItemsList,
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

const rssParser = new RSSParser();

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

export default function HomePage() {
  const [feeds, setFeeds] = useState<Record<string, Feed>>({});
  const [loading, setLoading] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    window.dbPromise = allStorage()
      .then((result) => {
        setFeeds(result);
        return true;
      })
      .catch((err) => {
        console.error("Failed to load feeds:", err);
        return false;
      });
  }, []);

  const deleteFeed = useCallback(async (url: string) => {
    await deleteSiteFeed(url);
    setFeeds((prev) => {
      const newFeeds = { ...prev };
      delete newFeeds[url];
      return newFeeds;
    });
  }, []);

  const addFeed = useCallback(async (url: string) => {
    try {
      setLoading(true);
      const feed = await rssParser.parseURL(url);
      const newFeed: Feed = {
        url,
        title: feed.title || url,
        favicon: await getFavicon(url),
      };
      await insertSiteFeed(newFeed);
      setFeeds((prev) => ({
        ...prev,
        [url]: newFeed,
      }));
    } catch (error) {
      console.error("Failed to add feed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFeed = useCallback(async (url: string, updates: Partial<Feed>) => {
    const feed = feeds[url];
    if (!feed) return;

    const updated = { ...feed, ...updates };
    await updateSiteFeed(url, updated);
    setFeeds((prev) => ({
      ...prev,
      [url]: updated,
    }));
  }, [feeds]);

  const filteredFeeds = useMemo(
    () =>
      Object.values(feeds).filter((f) => !favoritesOnly || f.isFavorite),
    [feeds, favoritesOnly]
  );

  return (
    <div className={Styles.container}>
      <NewFeedForm onAddFeed={addFeed} loading={loading} />
      {filteredFeeds.length > 0 && (
        <>
          <FavoritesList feeds={filteredFeeds} />
          <NewItemsList
            feeds={filteredFeeds}
            onDeleteFeed={deleteFeed}
            onUpdateFeed={updateFeed}
          />
          <VisitedItemsList feeds={filteredFeeds} />
        </>
      )}
    </div>
  );
}
