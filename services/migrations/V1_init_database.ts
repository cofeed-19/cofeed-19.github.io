import { SiteFeedParams} from "../../constants";
import { SiteFeed } from "../../models";
import { indexeddbCRUD } from "../index";
import { indexeddbService } from "../indexeddbService";

export async function V1_init_database(db: IDBDatabase){

    const { createTable } = indexeddbCRUD();

    await createTable(db, SiteFeedParams);
    const { insertSiteFeed } = indexeddbService();

    const localStorageData = extractFromLocalStorage();
    localStorageData.forEach(data => insertSiteFeed(data))
    
}

interface LocalStorage {
    items: LocalStorageFeed[];
    title: string;
    visited: any
  }

interface LocalStorageFeed{
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
    const container: LocalStorage = JSON.parse(localStorage.getItem(key) as string);
    
    let visited = {} as any;
    Object.keys(container.visited).forEach(visitedLink => visited[visitedLink] = true)

    userFeedCollection.push({Url: key, Visited: visited});

    }
  return userFeedCollection;
}
