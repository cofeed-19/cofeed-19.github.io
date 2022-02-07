import { useEffect, useState } from "react";
import RSSParser from "rss-parser";

import { ExternalLink, Footer, Header, HeadMeta } from "../components";

import JSONFeeds from "../data/feeds.json";
import { Feed } from "../types";
// import { UserFeed } from "../models";
import { useDBService } from "../services";

const rssParser = new RSSParser();

interface Props {
  list: { siteUrl: string; feedUrl: string; description: string }[];
}

export default function Feeds({ list }: Props) {

  // const [userFeed, setUserFeed] = useState<UserFeed>();
  const { insertUserFeed } = useDBService();

  const [added, setAdded] = useState("");

  useEffect(() => {
    if (!added) {
      return;
    }

    setTimeout(() => {
      setAdded("");
    }, 1500);
  }, [added]);

  async function onAdd(feedUrl: string) {
    let feed;
    try {
      feed = await rssParser.parseURL(feedUrl);
    } catch (_e) {}
    if (feed && !localStorage.getItem(feedUrl)) {
      const feedToAdd: Feed = {
        ...feed,
        visited: {},
      };
      // delete localstorage !!
      console.log(feed)
      localStorage.setItem(feedUrl, JSON.stringify(feedToAdd));

      // insertUserFeed({AddedSiteUrl: feedUrl});
      // console.log(`feedurl: ${feedUrl}, feedToAdd: ${JSON.stringify(feedToAdd.visited)}`);
    }
    setAdded(feedUrl);
  }

  return (
    <>
      <HeadMeta />
      <Header />
      <main>
        <h2>Feeds suggested by users</h2>
        <ExternalLink
          link="https://github.com/cofeed-19/cofeed-19.github.io/edit/main/data/feeds.json"
          title="Suggest a feed"
        />
        <dialog open={!!added}>{added} added to your feeds</dialog>
        <ul>
          {list.map((e) => (
            <li key={e.feedUrl}>
              <button onClick={() => onAdd(e.feedUrl)}>Add</button>
              <ExternalLink link={e.siteUrl} /> - {e.description}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      list: JSONFeeds,
    },
  };
}
