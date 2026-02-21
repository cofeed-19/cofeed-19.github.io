import { Feed } from "../models";
import { Favorite } from "./Favorite";

export type TransferData = {
  db: number;
  feed?: TransferFeed[];
  favorites?: Favorite[];
}

export type TransferFeed = Omit<Feed, "visited"> & {
  domain?: string; // deprecated, kept for backwards compatibility
  visited?: string[];
}
