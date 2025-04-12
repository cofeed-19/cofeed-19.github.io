import RSSParser from "rss-parser";

export interface Favorite extends RSSParser.Item {
  url: string;
  sourceFeedUrl: string;
  sourceFeedTitle: string;
  dateAdded: number;
}
