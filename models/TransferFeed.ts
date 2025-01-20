import { Feed, SiteFeed } from "./SiteFeed";

export interface TransferData {
  db: number;
  feed?: TransferFeed[];
}

export interface TransferFeed extends Omit<Feed, "visited"> {
  domain: string;
  visited?: string[];
}
