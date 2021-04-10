import React, { useEffect, useState } from "react";
import RSSParser from "rss-parser";
import { ExternalLink } from "../components/ExternalLink";

import { NewFeedForm } from "../components/NewFeedForm";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HeadMeta } from "../components/HeadMeta";
import { Feed } from "../types";

const rssParser = new RSSParser();

const CORS_PROXY = "https://thingproxy.freeboard.io/fetch/";

function allStorage(): FeedArchiveType {
  const archive: FeedArchiveType = {};

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith("http")) {
      continue;
    }
    const item = localStorage.getItem(key);
    if (item) {
      archive[key] = JSON.parse(item);
    }
  }

  return archive;
}

type FeedArchiveType = Record<string, Feed>;

export default function Home() {
  const [feedArchive, setFeedArchive] = useState<FeedArchiveType>({});

  async function onSubmit(newFeed: string): Promise<void> {
    const newFeeds = newFeed.split(",").filter(Boolean);

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
      if (feed && !localStorage.getItem(feedUrl)) {
        const feedToAdd: Feed = {
          ...feed,
          visited: {},
        };
        localStorage.setItem(feedUrl, JSON.stringify(feedToAdd));
      }
    }
    if (errors.length) {
      alert(
        `Could not add:\n${errors.join(
          "\n"
        )}\n\nProbable CORS issue😢!\nMaybe ask website owner to enable CORS🤔!`
      );
    }
    window.location.reload();
  }

  function onLinkClick(feedUrl: string, itemLink?: string) {
    if (!feedUrl || !itemLink) {
      return;
    }
    const rawFeed: string | null = localStorage.getItem(feedUrl);
    if (rawFeed) {
      const feed: Feed = JSON.parse(rawFeed);
      console.log(feed);
      if (feed.visited) {
        feed.visited[itemLink] = true;
      }
      localStorage.setItem(feedUrl, JSON.stringify(feed));
    }
  }

  function onRemoveClick(feedUrl: string, feedTitle?: string) {
    if (confirm(`Delete ${feedTitle} from feeds?`)) {
      localStorage.removeItem(feedUrl);
      window.location.reload();
    }
  }

  function onCopyClick() {
    const feedUrls = Object.keys(feedArchive);
    navigator.clipboard.writeText(feedUrls.join(",")).then(() => {
      alert("Feed urls copied to clipboard");
    });
  }

  useEffect(() => {
    async function updateFeeds() {
      const storage = allStorage();
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
            visited: storage[feedUrl].visited || {},
          };
          localStorage.setItem(feedUrl, JSON.stringify(feedToUpdate));
          storage[feedUrl] = feedToUpdate;
        }
      }
      setFeedArchive(storage);
    }

    updateFeeds();
  }, []);

  return (
    <>
      <HeadMeta />
      <Header />
      <main>
        <NewFeedForm onSubmit={onSubmit} />
        {Object.keys(feedArchive).map((feedUrl) => {
          const feed = feedArchive[feedUrl];
          return (
            <section key={feedUrl}>
              <h2>
                {feed?.title || feedUrl}{" "}
                <button onClick={() => onRemoveClick(feedUrl, feed?.title)}>
                  X
                </button>
              </h2>
              <ul>
                {feed?.items
                  .filter(
                    (item) =>
                      item.link && (!feed.visited || !feed.visited[item.link])
                  )
                  .map((item) =>
                    item.link ? (
                      <li>
                        <ExternalLink
                          key={item.link}
                          title={item.title || item.link}
                          link={item.link}
                          onClick={() => onLinkClick(feedUrl, item.link)}
                        />
                      </li>
                    ) : null
                  )}
              </ul>
              {Object.keys(feed.visited || {}).length ? (
                <details>
                  <summary>Visited from {feed?.title || feedUrl}</summary>
                  <ul>
                    {feed?.items
                      .filter(
                        (item) =>
                          item.link && feed.visited && feed.visited[item.link]
                      )
                      .map((item) =>
                        item.link ? (
                          <li>
                            <ExternalLink
                              key={item.link}
                              title={item.title || item.link}
                              link={item.link}
                              onClick={() => onLinkClick(feedUrl, item.link)}
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
