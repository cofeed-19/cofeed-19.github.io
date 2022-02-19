import React, { MouseEvent, useEffect, useState } from "react";
import RSSParser from "rss-parser";
import {
  ExternalLink,
  Footer,
  Header,
  HeadMeta,
  NewFeedForm,
  ProgressLoader,
} from "../components";
import { SiteFeed, Feed } from "../models";
import {
  deleteSiteFeed,
  getSiteFeed,
  getSiteFeeds,
  initDatabase,
  insertSiteFeed,
  updateSiteFeed,
} from "../services/indexeddbService";

declare global {
  interface Window {
    dbPromise: Promise<boolean>;
  }
}

const rssParser = new RSSParser();

const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";

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
      let feed;
      try {
        feed = await rssParser.parseURL(feedUrl);
      } catch (_e) {
        try {
          console.warn("Trying CORS_PROXY");
          feed = await rssParser.parseURL(CORS_PROXY + feedUrl);
        } catch (_e) {
          console.error(`Could not update feed for ${feedUrl}`);
        }
      }
      if (feed) {
        const feedToUpdate: Feed = {
          ...feed,
          url: feedUrl,
          visited: storage[feedUrl].visited || {},
        };
        storage[feedUrl] = feedToUpdate;
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
        try {
          console.warn("Trying CORS_PROXY");
          feed = await rssParser.parseURL(CORS_PROXY + feedUrl);
        } catch (_e) {
          errors.push(feedUrl);
        }
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

  async function onLinkClick(
    e: MouseEvent<HTMLAnchorElement> | undefined,
    feedUrl: string,
    itemLink?: string
  ) {
    if (!feedUrl || !itemLink) {
      return;
    }
    if (e) {
      e.currentTarget.style.color = "var(--link-visited-color)";
    }
    const siteFeed = await getSiteFeed(feedUrl);
    if (siteFeed.visited) {
      siteFeed.visited[itemLink] = true;
    }
    await updateSiteFeed(siteFeed);
  }

  function onRemoveClick(feedUrl: string, feedTitle?: string) {
    if (confirm(`Delete ${feedTitle} from feeds?`)) {
      deleteSiteFeed(feedUrl);
      updateFeeds();
    }
  }

  function onCopyClick() {
    const feedUrls = Object.keys(feedArchive);
    navigator.clipboard.writeText(feedUrls.join(",")).then(() => {
      alert("Feed urls copied to clipboard");
    });
  }

  useEffect(() => {
    updateFeeds();
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
      <main>
        <NewFeedForm onSubmit={onSubmit} />
        <ProgressLoader loadedFeeds={loadedFeeds} />
        {Object.keys(feedArchive).map((feedUrl) => {
          const feed = feedArchive[feedUrl];
          const newItems = feed?.items.filter(
            (item) => item.link && (!feed.visited || !feed.visited[item.link])
          );
          const vizitedItems = feed?.items.filter(
            (item) => item.link && feed.visited && feed.visited[item.link]
          );
          return (
            <section key={feedUrl}>
              <h2>
                {feed?.title || feedUrl}{" "}
                <button onClick={() => onRemoveClick(feedUrl, feed?.title)}>
                  X
                </button>
              </h2>
              <ul>
                {newItems?.map((item) =>
                  item.link ? (
                    <li key={item.link}>
                      <ExternalLink
                        title={item.title || item.link}
                        link={item.link}
                        onClick={(e) => onLinkClick(e, feedUrl, item.link)}
                      />
                    </li>
                  ) : null
                )}
              </ul>
              {newItems.length ? (
                <button
                  onClick={() => {
                    if (
                      confirm(`Mark all ${feed?.title || feedUrl} as visited?`)
                    ) {
                      newItems.forEach((item) =>
                        onLinkClick(undefined, feedUrl, item.link)
                      );
                      updateFeeds();
                    }
                  }}
                >
                  Mark all as visited
                </button>
              ) : null}
              {Object.keys(feed.visited || {}).length ? (
                <details>
                  <summary>Visited from {feed?.title || feedUrl}</summary>
                  <ul>
                    {vizitedItems?.map((item) =>
                      item.link ? (
                        <li key={item.link}>
                          <ExternalLink
                            title={item.title || item.link}
                            link={item.link}
                            onClick={(e) => onLinkClick(e, feedUrl, item.link)}
                          />
                        </li>
                      ) : null
                    )}
                  </ul>
                </details>
              ) : null}
            </section>
          );
        })}
        <button onClick={onCopyClick}>Copy feed urls</button>
      </main>
      <Footer />
    </>
  );
}
