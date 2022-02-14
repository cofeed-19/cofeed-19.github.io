import { V1_init_database, V2_smt } from "./migrations";
import { databaseName, databaseVersion, AddedSiteParams, SiteFeedParams} from "../constants";
import { useCRUD, FeedManager } from ".";
import { UserFeed, AddedSite, SiteFeed } from "../models";

export const useDBService = () => {

    const { insert, getByColumnName, getAll, deleteByID } = useCRUD();
    const { feedConverter } = FeedManager();

    async function initDatabase() {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = event => {

            console.log(`upgrade is called. old version = ${event.oldVersion}, new version ${event.newVersion}`);

            const db = request.result;
            
            switch(event.oldVersion){
                case 0:
                    V1_init_database(db);
                case 1:
                    V2_smt(db);
            }

            db.close();
        }
            
        request.onsuccess = () => {
            console.log("Database was successful created.");
        }

        request.onerror = () => {
            console.log("An error occurred initDatabase() function.");
        }
    }

    async function insertUserFeed(userFeed: UserFeed){

        const request = indexedDB.open(databaseName, databaseVersion);
        
        request.onsuccess = async () => {
            const db = request.result;
            
            let siteUrl =  await getByColumnName(db, AddedSiteParams.Name, AddedSiteParams.Url, userFeed.AddedSite.Url) as AddedSite;

            if(!siteUrl){
                const siteUrlObj: AddedSite[] = [{ Url:  userFeed.AddedSite.Url, Author: userFeed.AddedSite.Author, Title: userFeed.AddedSite.Title}]
                await insert(db, AddedSiteParams.Name, siteUrlObj);

                siteUrl =  await getByColumnName(db, AddedSiteParams.Name, AddedSiteParams.Url, userFeed.AddedSite.Url) as AddedSite;
            }

            let visitedSites: SiteFeed[] = [];
            
            userFeed.SiteFeed?.forEach( async (site, index) => {
                const visitedSite = await getByColumnName(db, SiteFeedParams.Name, SiteFeedParams.Url, site.Url);
                if(!visitedSite){
                    visitedSites.push({AddedSiteRef: siteUrl.ID, Url: site.Url, IsVisited: site.IsVisited, Title: site.Title})                    
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
            console.log("An error occurred insertUserFeed() function.")
        }
    }

    async function getUserFeed(setState: Function) {
        
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onsuccess = async () => {

            const db = request.result;

            const sitesLinks = await getAll(db, AddedSiteParams.Name) as AddedSite[];
            const visitedLinks = await getAll(db, SiteFeedParams.Name) as SiteFeed[];

            setState(feedConverter(visitedLinks, sitesLinks));

            db.close();
        }

        request.onerror = () => {
            console.log("An error occurred getUserFeed() function.")
        }
    }

    async function deleteFeed(siteName: string) {
        
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onsuccess = async () => {
            const db = request.result;

            const addedSiteToDelete = await getByColumnName(db, AddedSiteParams.Name, AddedSiteParams.Url, siteName) as AddedSite;

            await deleteByID(db, AddedSiteParams.Name, addedSiteToDelete.ID as number);

            const sitefeedToDelete = await getAll(db, SiteFeedParams.Name) as SiteFeed[];

            sitefeedToDelete.forEach( async site => {
                if(site.AddedSiteRef === addedSiteToDelete.ID){
                    await deleteByID(db, SiteFeedParams.Name, site.ID as number)
                }
            });

            db.close();
        }

        request.onerror = () => {
            console.log("An error occurred deleteFeed() function.")
        }
    }
    return {
        initDatabase,
        insertUserFeed,
        getUserFeed,
        deleteFeed
    }
}
