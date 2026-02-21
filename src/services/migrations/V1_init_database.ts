import { IDBPDatabase } from 'idb';
import { SiteFeedTable } from "../../constants";
import { Feed } from "../../models";
import { insertSiteFeed } from "../indexeddbService";

export async function V1_init_database(db: IDBPDatabase) {
  db.createObjectStore(SiteFeedTable.Name, { keyPath: SiteFeedTable.Key });

  const localStorageData = extractFromLocalStorage();
  localStorageData.forEach((data) => insertSiteFeed(data));
}

type LocalStorage = {
  items: LocalStorageFeed[];
  title: string;
  visited: any;
}

type LocalStorageFeed = {
  title: string;
  link: string;
  author: string;
}

function extractFromLocalStorage(): Feed[] {
  const userFeedCollection: Feed[] = [];

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith("http")) {
      continue;
    }
    const container: LocalStorage = JSON.parse(
      localStorage.getItem(key) as string
    );

    let visited = {} as any;
    Object.keys(container.visited).forEach(
      (visitedLink) => (visited[visitedLink] = true)
    );

    userFeedCollection.push({ url: key, visited: visited, items: [] });
  }
  return userFeedCollection;
}
