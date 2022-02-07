import { SiteUrlParams, VisitedUrlParams} from "../../constants";
import { useCRUD } from "../index";

export async function V1_init_database(db: any){

    const { createTable } = useCRUD();

    createTable(db, SiteUrlParams.Name, [SiteUrlParams.Url]);
    createTable(db, VisitedUrlParams.Name, [VisitedUrlParams.SiteUrlRef, VisitedUrlParams.FeedUrl]);

}