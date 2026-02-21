import { SiteFeedTable } from "../constants";
import { Feed } from "../models";
import { getDb } from "./db";

export async function getSiteFeeds(): Promise<Feed[]> {
  const db = await getDb();
  return db.getAll(SiteFeedTable.Name);
}

export async function getSiteFeed(feedUrl: string): Promise<Feed> {
  const db = await getDb();
  return db.get(SiteFeedTable.Name, feedUrl);
}

export async function insertSiteFeed(siteFeed: Feed): Promise<void> {
  const db = await getDb();
  await db.add(SiteFeedTable.Name, siteFeed);
}

// siteFeed must contain entire class, both old and new visited sites !!
export async function updateSiteFeed(siteFeed: Feed): Promise<void> {
  const db = await getDb();
  await db.put(SiteFeedTable.Name, siteFeed);
}

export async function deleteSiteFeed(feedUrl: string): Promise<void> {
  const db = await getDb();
  await db.delete(SiteFeedTable.Name, feedUrl);
}
