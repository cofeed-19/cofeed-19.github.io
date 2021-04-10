import RSSParser from "rss-parser";

export interface Feed extends RSSParser.Output<RSSParser.Item> {
  visited: Record<string, boolean>;
}
