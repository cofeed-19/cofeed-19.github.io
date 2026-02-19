import { Feed } from "../models";
import { Favorite } from "./Favorite";

export interface TransferData {
  db: number;
  feed?: TransferFeed[];
  favorites?: Favorite[];
}

export interface TransferFeed extends Omit<Feed, "visited"> {
  domain?: string; // deprecated, kept for backwards compatibility
  visited?: string[];
}
