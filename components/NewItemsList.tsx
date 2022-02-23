import React, { MouseEvent } from "react";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import { getSiteFeed, updateSiteFeed } from "../services/indexeddbService";
import { ExternalLink } from "./ExternalLink";

type Props = {
  feed: Feed;
  feedUrl: string;
  newItems: RSSParser.Item[];
  updateFeeds(): Promise<void>;
};

export function NewItemsList(props: Props) {
  const { feed, feedUrl, newItems, updateFeeds } = props;

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

  async function markAllAsVisited(feedUrl: string, itemLinks: string[]) {
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
  }

  return (
    <>
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
