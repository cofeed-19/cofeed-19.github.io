import React, { MouseEvent } from "react";
import RSSParser from "rss-parser";
import { Feed } from "../models";
import { ExternalLink } from "./ExternalLink";

type Props = {
  feed: Feed;
  feedUrl: string;
  newItems: RSSParser.Item[];
  onLinkClick: (
    e: MouseEvent<HTMLAnchorElement> | undefined,
    feedUrl: string,
    itemLink?: string | undefined
  ) => Promise<void>;
  updateFeeds(): Promise<void>;
};

export function NewItemsList(props: Props) {
  const { feed, feedUrl, newItems, onLinkClick, updateFeeds } = props;
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
    </>
  );
}
