import { databaseName, databaseVersion, SiteFeedParams } from "../constants";
import { SiteFeed } from "../models";
import { deleteByName, getAll, insert, update } from "./indexeddbCRUD";
import { executeMigrations } from "./migrations";

export async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = (event) => {
      console.log(
        `upgrade is called. old version = ${event.oldVersion}, new version ${event.newVersion}`
      );

      const db = request.result;

      executeMigrations(event.oldVersion, db).then((done: boolean) => {
        console.log({ done });
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

export async function getSitesFeed(setState: Function) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    const sitesFeed = (await getAll(db, SiteFeedParams.Name)) as SiteFeed[];

    setState(sitesFeed);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred getSitesFeed() function.");
  };
}

export async function insertSiteFeed(siteFeed: SiteFeed) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    await insert(db, SiteFeedParams.Name, [siteFeed]);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred insertSiteFeed() function.");
  };
}

// siteFeed must contain entire class, both old and new visited sites !!
export async function updateSiteFeed(siteFeed: SiteFeed) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    await update(db, SiteFeedParams.Name, siteFeed);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred updateSiteFeed() function.");
  };
}

export async function deleteSiteFeed(siteName: string) {
  const request = indexedDB.open(databaseName, databaseVersion);

  request.onsuccess = async () => {
    const db = request.result;

    await deleteByName(db, SiteFeedParams.Name, siteName);

    db.close();
  };

  request.onerror = async () => {
    console.log("An error occurred deleteSiteFeed() function.");
  };
}
