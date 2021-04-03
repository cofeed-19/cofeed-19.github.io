import Head from "next/head";
import { useEffect, useState } from "react";

import RSSParser from "rss-parser";

const STORAGE_PREFIX = "FWF_";
const rssParser = new RSSParser();

function allStorage() {
  const archive: Record<string, any> = {};

  for (const key of Object.keys(localStorage).filter((k) =>
    k.startsWith(STORAGE_PREFIX)
  )) {
    archive[key] = localStorage.getItem(key);
  }

  return archive;
}

export default function Home() {
  const [feed, setFeed] = useState<RSSParser.Output<RSSParser.Item> | null>(
    null
  );

  useEffect(() => {
    const storage = allStorage();
    console.log({ storage });
  }, []);

  useEffect(() => {
    async function getFeed() {
      const feed = await rssParser.parseURL(
        "https://strdr4605.github.io/rss.xml"
      );
      setFeed(feed);
      console.log(feed);
    }
    getFeed();
  }, []);

  return (
    <div>
      <Head>
        <title>Free web feed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Free web feed</h1>
        <h2>{feed?.title}</h2>
        {feed?.items.map((item) => {
          console.log({ item });
          return (
            <div key={item.link}>
              <a href={item.link} rel="noopener noreferrer" target="_blank">
                {item.title}
              </a>
            </div>
          );
        })}
      </main>

      <footer>Footer</footer>
    </div>
  );
}
