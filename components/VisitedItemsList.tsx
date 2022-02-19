import React from "react";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import { ExternalLink } from "./ExternalLink";

type Props = {
  feed: Feed;
  feedUrl: string;
  visitedItems: RSSParser.Item[];
};

export function VisitedItemsList({ feed, feedUrl, visitedItems }: Props) {
  return (
    <>
      {Object.keys(feed.visited || {}).length ? (
        <details>
          <summary>Visited from {feed?.title || feedUrl}</summary>
          <ul>
            {visitedItems?.map((item) =>
              item.link ? (
                <li key={item.link}>
                  <ExternalLink
                    title={item.title || item.link}
                    link={item.link}
                  />
                </li>
              ) : null
            )}
          </ul>
        </details>
      ) : null}
    </>
  );
}
