import React from "react";
import RSSParser from "rss-parser";
import { DateComponent } from "../Date/Date";
import { Feed } from "../../models";
import { ExternalLink } from "../ExternalLink/ExternalLink";
import Styles from "./VisitedItemsList.module.css";

type Props = {
  feed: Feed;
  feedUrl: string;
  visitedItems: RSSParser.Item[];
};

export function VisitedItemsList({ feed, feedUrl, visitedItems }: Props) {
  return Object.keys(feed.visited || {}).length ? (
    <details className={Styles.container}>
      <summary>Visited from {feed?.title || feedUrl}</summary>
      <ul>
        {visitedItems?.map((item) =>
          item.link ? (
            <li key={item.link}>
              <DateComponent date={item.pubDate} />
              <ExternalLink title={item.title || item.link} link={item.link} />
            </li>
          ) : null
        )}
      </ul>
    </details>
  ) : null;
}
