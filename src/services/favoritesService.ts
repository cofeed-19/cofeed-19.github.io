import RSSParser from "rss-parser";
import { FavoriteTable } from "../constants";
import { Favorite, Feed } from "../models";
import { getDb } from "./db";

export async function getFavorites(): Promise<Favorite[]> {
  const db = await getDb();
  return db.getAll(FavoriteTable.Name);
}

export async function getFavorite(url: string): Promise<Favorite | null> {
  const db = await getDb();
  const favorite = await db.get(FavoriteTable.Name, url);
  return favorite || null;
}

export async function addFavorite(
  item: RSSParser.Item,
  feed: Feed
): Promise<void> {
  if (!item.link) return;

  const favorite: Favorite = {
    ...item,
    url: item.link,
    sourceFeedUrl: feed.link,
    sourceFeedTitle: feed.title || feed.link,
    dateAdded: Date.now(),
  };

  const db = await getDb();
  await db.add(FavoriteTable.Name, favorite);
}

export async function removeFavorite(url: string): Promise<void> {
  const db = await getDb();
  await db.delete(FavoriteTable.Name, url);
}

export async function addFavorites(favorites: Favorite[]): Promise<void> {
  const db = await getDb();
  for (const favorite of favorites) {
    await db.add(FavoriteTable.Name, favorite);
  }
}
