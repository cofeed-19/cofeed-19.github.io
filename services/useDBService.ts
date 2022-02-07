import { V1_init_database, V2_smt } from "./migrations";
import { databaseName, databaseVersion, AddedSiteParams, SiteFeedParams} from "../constants";
import { useCRUD, FeedManager } from ".";
import { UserFeed, AddedSite, SiteFeed } from "../models";

export const useDBService = () => {

    const { insert, getByColumnName, getAll } = useCRUD();
    const { feedConverter } = FeedManager();

    async function initDatabase() {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = event => {
            // alert(`upgrade is called. old version = ${e.oldVersion}, new version ${e.newVersion}`);

            const db = request.result;
            
            switch(event.oldVersion){
                case 0:
                    V1_init_database(db);
                case 1:
                    V2_smt(db);
                case 2: 
            }

            db.close();
    }
            
        request.onsuccess = () => {
            // alert("succes is called");
        }

        request.onerror = () => {
            // alert("Error occurred")
        }
    }

    async function insertUserFeed(userFeed: UserFeed){

        const request = indexedDB.open(databaseName, databaseVersion);
        
        request.onsuccess = async () => {
            const db = request.result;
            
            let siteUrl =  await getByColumnName(db, AddedSiteParams.Name, AddedSiteParams.Url, userFeed.AddedSite.Url) as AddedSite;

            if(!siteUrl){
                const siteUrlObj: AddedSite[] = [{ Url:  userFeed.AddedSite.Url, Author: userFeed.AddedSite.Author}]
                await insert(db, AddedSiteParams.Name, siteUrlObj);

                siteUrl =  await getByColumnName(db, AddedSiteParams.Name, AddedSiteParams.Url, userFeed.AddedSite.Url) as AddedSite;
            }

            let visitedSites: SiteFeed[] = [];
            
            userFeed.SiteFeed?.forEach( async (site, index) => {
                const visitedSite = await getByColumnName(db, SiteFeedParams.Name, SiteFeedParams.Url, site.Url);
                if(!visitedSite){
                    visitedSites.push({AddedSiteRef: siteUrl.ID, Url: site.Url, IsVisited: site.IsVisited})                    
                }
                console.log(userFeed.SiteFeed);
                console.log(visitedSites.length)

                if(userFeed.SiteFeed && visitedSites.length && (userFeed?.SiteFeed.length - 1) === index){
                    console.log(visitedSites)
                    await insert(db, SiteFeedParams.Name, visitedSites);
                    db.close();
                }
            });           
        }
        request.onerror = () => {
            alert("error")
        }
    }

    async function getUserFeed(setState: Function) {
        
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onsuccess = async () => {

            const db = request.result;

            const visitedLinks = await getAll(db, SiteFeedParams.Name) as SiteFeed[];
            const sitesLinks = await getAll(db, AddedSiteParams.Name) as AddedSite[];

            setState(feedConverter(visitedLinks, sitesLinks));            
        }
    }

    return {
        initDatabase,
        insertUserFeed,
        getUserFeed
    }
}