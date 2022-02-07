import { AddedSiteParams, SiteFeedParams} from "../../constants";
import { useCRUD } from "../index";

export async function V1_init_database(db: any){

    const { createTable } = useCRUD();
    
    createTable(db, AddedSiteParams);
    createTable(db, SiteFeedParams);

}