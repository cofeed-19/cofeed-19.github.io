import { SiteFeedTable } from "../../constants";
import { SiteFeed } from "../../models";
import { createTable } from "../indexeddbCRUD";
import { insertSiteFeed } from "../indexeddbService";

export async function V1_init_database(db: IDBDatabase) {
  await createTable(db, SiteFeedTable);

  const localStorageData = extractFromLocalStorage();
  localStorageData.forEach((data) => insertSiteFeed(data));
}

interface LocalStorage {
  items: LocalStorageFeed[];
  title: string;
  visited: any;
}

interface LocalStorageFeed {
  title: string;
  link: string;
  author: string;
}

function extractFromLocalStorage(): SiteFeed[] {
  const userFeedCollection: SiteFeed[] = [];

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

    userFeedCollection.push({ url: key, visited: visited });
  }
  return userFeedCollection;
}
