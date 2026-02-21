import RSSParser from "rss-parser";

export type Favorite = RSSParser.Item & {
  url: string;
  sourceFeedUrl?: string;
  sourceFeedTitle?: string;
  dateAdded: number;
}
