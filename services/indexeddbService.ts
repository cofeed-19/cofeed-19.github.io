import { executeMigrations} from "./migrations";
import { databaseName, databaseVersion, SiteFeedParams} from "../constants";
import { indexeddbCRUD } from ".";
import { SiteFeed } from "../models";

export const indexeddbService = () => {

    const { insert, getAll, update, deleteByName } = indexeddbCRUD();

    async function initDatabase() {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = event => {

            console.log(`upgrade is called. old version = ${event.oldVersion}, new version ${event.newVersion}`);

            const db = request.result;
            
            executeMigrations(event.oldVersion, db)

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

    // siteFeed must contain entire class, both old and new visited sites !!
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

    async function deleteSiteFeed(siteName: string) {

        const request = indexedDB.open(databaseName, databaseVersion);

        request.onsuccess = async () => {
            const db = request.result;

            await deleteByName(db, SiteFeedParams.Name, siteName)

            db.close();
        }

        request.onerror = async () => {
            console.log("An error occurred deleteSiteFeed() function.");
        }
    }

    return {
        initDatabase,
        getSitesFeed,
        insertSiteFeed,
        updateSiteFeed,
        deleteSiteFeed
    }
}
