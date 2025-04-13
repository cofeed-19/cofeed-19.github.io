import RSSParser from "rss-parser";
import { databaseName, databaseVersion, FavoriteTable } from "../constants";
import { Favorite, Feed } from "../models";
import { deleteByName, getAll, getOne, insert } from "./indexeddbCRUD";

export async function getFavorites(): Promise<Favorite[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;
      const favorites = (await getAll(db, FavoriteTable.Name)) as Favorite[];
      resolve(favorites);
      db.close();
    };

    request.onerror = () => {
      console.log("An error occurred getFavorites() function.");
      reject([]);
    };
  });
}

export async function getFavorite(url: string): Promise<Favorite | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;
      const favorite = (await getOne(db, FavoriteTable.Name, url)) as Favorite;
      resolve(favorite || null);
      db.close();
    };

    request.onerror = () => {
      console.log("An error occurred getFavorite() function.");
      reject(null);
    };
  });
}

export async function addFavorite(
  item: RSSParser.Item,
  feed: Feed
): Promise<void> {
  if (!item.link) return;

  const favorite: Favorite = {
    ...item,
    url: item.link,
    sourceFeedUrl: feed.url,
    sourceFeedTitle: feed.title || feed.url,
    dateAdded: Date.now(),
  };

  const request = indexedDB.open(databaseName, databaseVersion);

  return new Promise((resolve, reject) => {
    request.onsuccess = async () => {
      const db = request.result;
      await insert(db, FavoriteTable.Name, [favorite]);
      db.close();
      resolve();
    };

    request.onerror = () => {
      console.log("An error occurred addFavorite() function.");
      reject();
    };
  });
}

export async function removeFavorite(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;
      await deleteByName(db, FavoriteTable.Name, url);
      db.close();
      resolve();
    };

    request.onerror = () => {
      console.log("An error occurred removeFavorite() function.");
      reject();
    };
  });
}
