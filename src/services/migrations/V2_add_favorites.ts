import { IDBPDatabase } from 'idb';
import { FavoriteTable } from "../../constants";

export async function V2_add_favorites(db: IDBPDatabase) {
  db.createObjectStore(FavoriteTable.Name, { keyPath: FavoriteTable.Key });
}
