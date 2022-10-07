import RSSParser from "rss-parser";
export interface Feed extends RSSParser.Output<RSSParser.Item> {
  favicon?: string;
  visited: Record<string, boolean>;
  url: string;
}
export interface SiteFeed {
  url: string;
  visited?: Record<string, boolean>;
}
