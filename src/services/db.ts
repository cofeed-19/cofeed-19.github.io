import { openDB, IDBPDatabase } from 'idb';
import { databaseName, databaseVersion } from '../constants';
import { executeMigrations } from './migrations';

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(databaseName, databaseVersion, {
      upgrade(db, oldVersion) {
        return executeMigrations(oldVersion, db);
      },
    });
  }
  return dbPromise;
}
