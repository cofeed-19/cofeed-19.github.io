import { IDBPDatabase } from 'idb';
import { V1_init_database } from "./V1_init_database";
import { V2_add_favorites } from "./V2_add_favorites";
// import { V3_migration } from "./V3_migration";

const migrations: ((db: IDBPDatabase) => Promise<void>)[] = [
  V1_init_database,
  V2_add_favorites,
  //   V3_migration,
];

export async function executeMigrations(oldDbVersion: number, db: IDBPDatabase) {
  const executableMigrations = migrations.slice(oldDbVersion);
  return executableMigrations
    .reduce(
      (currentMigration, nextMigration) =>
        currentMigration.then(() => nextMigration(db)),
      Promise.resolve()
    )
    .then(() => true);
}
