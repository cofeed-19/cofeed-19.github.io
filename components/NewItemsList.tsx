import React, { MouseEvent, useCallback } from "react";
import RSSParser from "rss-parser";
import { DateComponent } from ".";
import { Feed } from "../models";
import { getSiteFeed, updateSiteFeed } from "../services/indexeddbService";
import { ExternalLink } from "./ExternalLink";
import Styles from "../styles/NewItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  newItems: RSSParser.Item[];
  updateFeeds(): Promise<void>;
};

const onLinkClick = async (feedUrl?: string, itemLink?: string) => {
  if (!feedUrl || !itemLink) {
    return;
  }

  const siteFeed = await getSiteFeed(feedUrl);
  if (siteFeed.visited) {
    siteFeed.visited[itemLink] = true;
  }

  await updateSiteFeed(siteFeed);
};

const markAllAsVisited = async (feedUrl: string, itemLinks: string[]) => {
  if (!feedUrl || !itemLinks.length) {
    return;
  }

  const siteFeed = await getSiteFeed(feedUrl);
  if (siteFeed.visited) {
    for (const itemLink of itemLinks) {
      siteFeed.visited[itemLink] = true;
    }
  }

  await updateSiteFeed(siteFeed);
};

export function NewItemsList(props: Props) {
  const { feed, feedUrl, newItems, updateFeeds } = props;

  return (
    <>
      <ul className={Styles.list}>
        {newItems?.map((item) =>
          item.link ? (
            <li key={item.link}>
              <DateComponent date={item.pubDate} />
              <ExternalLink
                title={item.title || item.link}
                link={item.link}
                onClick={() => onLinkClick(feedUrl, item.link)}
              />
            </li>
          ) : null
        )}
      </ul>
      {newItems.length ? (
        <button
          onClick={() => {
            if (confirm(`Mark all ${feed?.title || feedUrl} as visited?`)) {
              markAllAsVisited(
                feedUrl,
                newItems.map((item) => item.link || "").filter(Boolean)
              );
              updateFeeds();
            }
          }}
        >
          Mark all as visited
        </button>
      ) : null}
    </>
  );
}
