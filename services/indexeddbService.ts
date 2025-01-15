import { databaseName, databaseVersion, SiteFeedTable } from "../constants";
import { Feed, SiteFeed } from "../models";
import { deleteByName, getAll, getOne, insert, update } from "./indexeddbCRUD";
import { executeMigrations } from "./migrations";

export async function initDatabase(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = (event) => {
      console.log(
        `upgrade is called. old version = ${event.oldVersion}, new version ${event.newVersion}`
      );

      const db = request.result;

      executeMigrations(event.oldVersion, db).then((done: boolean) => {
        resolve(done);
        db.close();
      });
    };

    request.onsuccess = () => {
      console.log("Database was successful created.");
      resolve(true);
    };

    request.onerror = () => {
      console.log("An error occurred initDatabase() function.");
      reject(false);
    };
  });
}

export async function getSiteFeeds(): Promise<Feed[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;

      const siteFeeds = (await getAll(db, SiteFeedTable.Name)) as Feed[];

      resolve(siteFeeds);
      db.close();
    };

    request.onerror = async () => {
      console.log("An error occurred getSiteFeeds() function.");
      reject("An error occurred getSiteFeeds() function.");
    };
  });
}

export async function getSiteFeed(feedUrl: string): Promise<SiteFeed> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;

      const siteFeeds = (await getOne(
        db,
        SiteFeedTable.Name,
        feedUrl
      )) as SiteFeed;

      resolve(siteFeeds);
      db.close();
    };

    request.onerror = async () => {
      console.log("An error occurred getSiteFeeds() function.");
      reject("An error occurred getSiteFeeds() function.");
    };
  });
}

export async function insertSiteFeed(siteFeed: Feed) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    await insert(db, SiteFeedTable.Name, [siteFeed]);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred insertSiteFeed() function.");
  };
}

// siteFeed must contain entire class, both old and new visited sites !!
export async function updateSiteFeed(siteFeed: Feed) {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onsuccess = async () => {
      const db = request.result;

      await update(db, SiteFeedTable.Name, siteFeed);

      db.close();

      resolve();
    };

    request.onerror = async () => {
      console.log("An error occurred updateSiteFeed() function.");

      reject();
    };
  });
}

export async function deleteSiteFeed(feedUrl: string) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    await deleteByName(db, SiteFeedTable.Name, feedUrl);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred deleteSiteFeed() function.");
  };
}
