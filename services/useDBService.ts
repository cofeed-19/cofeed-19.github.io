import { dbVersion1, dbVersion2 } from "./migrations";
import { databaseName, databaseVersion, TableNames} from "../constants";
import { useCRUD, FeedManager } from ".";
import { UserFeed, SiteUrl, VisitedUrl } from "../models";

export const useDBService = () => {

    const { createTable, insert, getByColumnName, getAll } = useCRUD();
    const { feedConverter } = FeedManager();

    async function initDatabase() {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = e => {
            alert(`upgrade is called. old version = ${e.oldVersion}, new version ${e.newVersion}`);

            const db = request.result;
            createTable(db, TableNames.SiteUrls, ["Url"]);
            createTable(db, TableNames.VisitedUrls, ["SiteUrlRef", "FeedUrl"]);

            db.close();
    }
            
        request.onsuccess = () => {
            alert("succes is called");
            const db = request.result;
            db.close();
        }

        request.onerror = () => {
            alert("Error occurred")
        }
    }

    async function insertUserFeed(userFeed: UserFeed){

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onsuccess = async () => {

            const db = request.result;
            
            var siteUrl =  await getByColumnName(db, TableNames.SiteUrls, "Url", userFeed.SiteUrl) as SiteUrl;

            if(!siteUrl){
                const siteUrlObj = [{ "Url":  userFeed.SiteUrl}]
                await insert(db, TableNames.SiteUrls, siteUrlObj);

                siteUrl =  await getByColumnName(db, TableNames.SiteUrls, "Url", userFeed.SiteUrl) as SiteUrl;
            }

            var visitedSites: object[] = [];

            userFeed.Visited.forEach(async site => {
                const visitedSite =  await getByColumnName(db, TableNames.VisitedUrls, "FeedUrl", site) as SiteUrl;
                if(!visitedSite){
                    visitedSites.push({"SiteUrlRef": siteUrl.ID, "FeedUrl": site})                    
                }
            });

            if(visitedSites.length){
                await insert(db, TableNames.VisitedUrls, visitedSites);
            }
            db.close();
        }
    }

    async function getUserFeed(setState: Function) {
        
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onsuccess = async () => {

            const db = request.result;

            const visitedLinks = await getAll(db, TableNames.VisitedUrls) as VisitedUrl[];
            const sitesLinks = await getAll(db, TableNames.SiteUrls) as SiteUrl[];

            setState(feedConverter(visitedLinks, sitesLinks));            
        }
    }

    return {
        initDatabase,
        insertUserFeed,
        getUserFeed
    }
}