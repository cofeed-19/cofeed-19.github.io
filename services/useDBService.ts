import { dbVersion1, dbVersion2 } from "./migrations";
import { databaseName, databaseVersion, TableNames} from "../constants";
import { useCRUD } from ".";
import { UserFeed, SiteUrl } from "../models";

export const useDBService = () => {

    const { createTable, insertValues, getValueByColumnName } = useCRUD();

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
            
            var siteUrl =  await getValueByColumnName(db, TableNames.SiteUrls, "Url", userFeed.SiteUrl) as SiteUrl;

            if(!siteUrl){
                var siteUrlObj = [{ "Url":  userFeed.SiteUrl}]
                await insertValues(db, TableNames.SiteUrls, siteUrlObj);

                siteUrl =  await getValueByColumnName(db, TableNames.SiteUrls, "Url", userFeed.SiteUrl) as SiteUrl;
            }

            var visitedSites: object[] = [];

            userFeed.Visited.forEach(async site => {
                const visitedSite =  await getValueByColumnName(db, TableNames.VisitedUrls, "FeedUrl", site) as SiteUrl;
                if(!visitedSite){
                    visitedSites.push({"SiteUrlRef": siteUrl.ID, "FeedUrl": site})                    
                }
            });

            if(visitedSites.length){
                await insertValues(db, TableNames.VisitedUrls, visitedSites);
            }
            
            alert(`succes : data ${siteUrl.Url}`);


            db.close();
        }
    }

    return {
        initDatabase,
        insertUserFeed
    }
}