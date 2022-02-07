import { V1_init_database, V2_smt } from "./migrations";
import { databaseName, databaseVersion, SiteUrlParams, VisitedUrlParams} from "../constants";
import { useCRUD, FeedManager } from ".";
import { UserFeed, SiteUrl, VisitedUrl } from "../models";

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
            
            let siteUrl =  await getByColumnName(db, SiteUrlParams.Name, SiteUrlParams.Url, userFeed.SiteUrl) as SiteUrl;

            if(!siteUrl){
                const siteUrlObj: SiteUrl[] = [{ Url:  userFeed.SiteUrl}]
                await insert(db, SiteUrlParams.Name, siteUrlObj);

                siteUrl =  await getByColumnName(db, SiteUrlParams.Name, SiteUrlParams.Url, userFeed.SiteUrl) as SiteUrl;
            }

            let visitedSites: VisitedUrl[] = [];
            
            userFeed.Visited?.forEach( async (site, index) => {
                const visitedSite = await getByColumnName(db, VisitedUrlParams.Name, VisitedUrlParams.FeedUrl, site);
                if(!visitedSite){
                    visitedSites.push({SiteUrlRef: siteUrl.ID, FeedUrl: site})                    
                }
                console.log(userFeed.Visited);
                console.log(visitedSites.length)

                if(userFeed.Visited && visitedSites.length && (userFeed?.Visited.length - 1) === index){
                    console.log(visitedSites)
                    await insert(db, VisitedUrlParams.Name, visitedSites);
                    db.close();
                }
            });           
        }
    }

    async function getUserFeed(setState: Function) {
        
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onsuccess = async () => {

            const db = request.result;

            const visitedLinks = await getAll(db, VisitedUrlParams.Name) as VisitedUrl[];
            const sitesLinks = await getAll(db, SiteUrlParams.Name) as SiteUrl[];

            setState(feedConverter(visitedLinks, sitesLinks));            
        }
    }

    return {
        initDatabase,
        insertUserFeed,
        getUserFeed
    }
}