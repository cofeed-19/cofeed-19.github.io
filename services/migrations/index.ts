import { V1_init_database } from './V1_init_database';
import { V2_migration } from './V2_migration';
import { V3_migration } from './V3_migration';

const migrations: Function[] = [V1_init_database, V2_migration, V3_migration] 

export function executeMigrations(oldDbVersion: number, db: IDBDatabase){

    const executableMigrations = migrations.slice(oldDbVersion);
    executableMigrations.forEach(migration => migration(db))
}
