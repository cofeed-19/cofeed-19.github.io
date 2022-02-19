import { V1_init_database } from "./V1_init_database";
import { V2_migration } from "./V2_migration";
import { V3_migration } from "./V3_migration";

const migrations: ((db: IDBDatabase) => Promise<void>)[] = [
  V1_init_database,
  V2_migration,
  V3_migration,
];

export async function executeMigrations(oldDbVersion: number, db: IDBDatabase) {
  const executableMigrations = migrations.slice(oldDbVersion);
  return executableMigrations
    .reduce(
      (currentMigration, nextMigration) =>
        currentMigration.then(() => nextMigration(db)),
      Promise.resolve()
    )
    .then(() => true);
}
