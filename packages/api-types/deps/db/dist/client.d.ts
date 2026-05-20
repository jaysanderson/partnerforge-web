import Database from 'better-sqlite3';
import * as schema from './schema.js';
export type DbConnection = ReturnType<typeof createConnection>;
export declare function createConnection(dbPath?: string): import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema> & {
    $client: Database.Database;
};
/** Process-wide shared connection. */
export declare function getDb(): DbConnection;
export { schema };
