import RSSParser from "rss-parser";

export type Feed = RSSParser.Output<RSSParser.Item> & SiteFeed & {
  favicon?: string;
  visited: Record<string, boolean>;
  loaded?: boolean;
}

export type SiteFeed = {
  url: string;
  priority?: number;
  visited?: Record<string, boolean>;
}
