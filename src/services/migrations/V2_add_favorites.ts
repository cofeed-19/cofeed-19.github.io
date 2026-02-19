import { FavoriteTable } from "../../constants";
import { createTable } from "../indexeddbCRUD";

export async function V2_add_favorites(db: IDBDatabase) {
  await createTable(db, FavoriteTable);
}
