import Head from "next/head";
import { useEffect, useState } from "react";
import RSSParser from "rss-parser";

import { NewFeedForm } from "../components/NewFeedForm";
import { STORAGE_PREFIX } from "../constants";

const rssParser = new RSSParser();

function allStorage(): FeedArchiveType {
  const archive: Record<string, any> = {};

  const FWFStorageKeys = Object.keys(localStorage).filter((k) =>
    k.startsWith(STORAGE_PREFIX)
  );

  for (const key of FWFStorageKeys) {
    const item = localStorage.getItem(key);
    if (item) {
      archive[key] = JSON.parse(item);
    }
  }

  return archive;
}

type FeedArchiveType = Record<string, RSSParser.Output<RSSParser.Item> | null>;

export default function Home() {
  const [feedArchive, setFeedArchive] = useState<FeedArchiveType>({});

  async function onSubmit(newFeed: string): Promise<void> {
    try {
      const feed = await rssParser.parseURL(newFeed);
      if (!localStorage.getItem(STORAGE_PREFIX + newFeed)) {
        localStorage.setItem(STORAGE_PREFIX + newFeed, JSON.stringify(feed));
      }
    } catch (e) {
      alert(newFeed + " does not allow CROS");
    }
  }

  useEffect(() => {
    const storage = allStorage();
    setFeedArchive(storage);
    console.log({ storage });
  }, []);

  return (
    <div>
      <Head>
        <title>Free web feed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Free web feed</h1>
        <p style={{ color: "red" }}>
          This app works only on the browser. Some web feeds are blocked by CORS
          policy.
        </p>
        <hr />
        <NewFeedForm onSubmit={onSubmit} />
        {Object.keys(feedArchive).map((feedKey) => {
          const feed = feedArchive[feedKey];
          return (
            <div key={feedKey}>
              <h2>{feed?.title}</h2>
              {feed?.items.map((item, i) => {
                console.log({ item });
                const t =
                  i % 2
                    ? "fdaffgdsgfdsgfdaffgdsgfdsgfdaffgdsgfdsgfdaffgdsgfdsgfdaffgdsgfdsgfdaffgdsgfdsg"
                    : "";
                return (
                  <div key={item.link}>
                    <a
                      href={item.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.title}
                    </a>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>

      <footer>
        <hr />© {new Date().getFullYear()}{" "}
        <a href="https://github.com/strdr4605/">@strdr4605</a>.
      </footer>
    </div>
  );
}
