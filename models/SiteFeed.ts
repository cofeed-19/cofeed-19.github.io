import RSSParser from "rss-parser";

export interface Feed extends RSSParser.Output<RSSParser.Item>, SiteFeed {
  favicon?: string;
  visited: Record<string, boolean>;
}

export interface SiteFeed {
  url: string;
  favorite?: boolean;
  visited?: Record<string, boolean>;
}
