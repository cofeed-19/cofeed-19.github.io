import { AddedSiteParams, SiteFeedParams} from "../../constants";
import { UserFeed } from "../../models";
import { useCRUD } from "../index";
import { useDBService } from "../useDBService";

export async function V1_init_database(db: any){

    const { createTable } = useCRUD();
    const { insertUserFeed } = useDBService();

    await createTable(db, AddedSiteParams);
    await createTable(db, SiteFeedParams);

    const localStorageData = extractFromLocalStorage();
    localStorageData.forEach(data => insertUserFeed(data))
    
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

  function extractFromLocalStorage(): UserFeed[] {

    const userFeedCollection: UserFeed[] = [];
      
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith("http")) {
        continue;
      }
      const container: LocalStorage = JSON.parse(localStorage.getItem(key) as string);

      var userFeed: UserFeed = {AddedSite: {Url: key, Author: container.items[0].author}, SiteFeed: []}

      container.items.forEach(item => userFeed.SiteFeed?.push({Url: item.link, IsVisited: false, Title: item.title}));

      Object.keys(container.visited).forEach(visitedLink => userFeed.SiteFeed?.push({Url: visitedLink, IsVisited: true}))
      userFeedCollection.push(userFeed)

      }
      return userFeedCollection;
  }