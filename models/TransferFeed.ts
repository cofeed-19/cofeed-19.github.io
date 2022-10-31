import { SiteFeed } from "./SiteFeed";

export interface TransferData {
  db: number;
  feed?: TransferFeed[];
}

export interface TransferFeed extends Omit<SiteFeed, "visited"> {
  domain: string;
  visited?: string[];
}
