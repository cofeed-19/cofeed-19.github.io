import { V1_init_database, V2_smt } from "./migrations";
import { databaseName, databaseVersion, SiteFeedParams} from "../constants";
import { indexeddbCRUD } from ".";
import { SiteFeed } from "../models";

export const indexeddbService = () => {

    const { insert, getAll, update } = indexeddbCRUD();

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

    async function getSitesFeed(setState: Function) {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onsuccess = async () => {
            const db = request.result;

            const sitesFeed = await getAll(db, SiteFeedParams.Name) as SiteFeed[];

            setState(sitesFeed);

            db.close();
        }

        request.onerror = async () => {
            console.log("An error occurred getSitesFeed() function.");
        }
    }

    async function insertSiteFeed(siteFeed: SiteFeed) {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onsuccess = async () => {
            const db = request.result;

            await insert(db, SiteFeedParams.Name, [siteFeed]);

            db.close();
        }

        request.onerror = async () => {
            console.log("An error occurred insertSiteFeed() function.");
        }
    }

    // can be used to update or to delete data
    async function updateSiteFeed(siteFeed: SiteFeed) {
        
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onsuccess = async () => {
            const db = request.result;

            await update(db, SiteFeedParams.Name, siteFeed)

            db.close();
        }

        request.onerror = async () => {
            console.log("An error occurred updateSiteFeed() function.");
        }
    }

    return {
        initDatabase,
        getSitesFeed,
        insertSiteFeed,
        updateSiteFeed
    }
}
