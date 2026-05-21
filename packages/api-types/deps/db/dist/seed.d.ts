import { type DbConnection } from './client.js';
/**
 * Idempotent seed. Stable ids + onConflictDoNothing so re-running after a
 * migrate never duplicates rows.
 */
/**
 * Insert/repair the demo dataset on the given connection. Idempotent
 * (onConflictDoNothing + targeted backfills). Exported so the Console's
 * "Reset to demo data" action can re-seed after a live Salesforce purge.
 */
export declare function seedDemoData(db: DbConnection): void;
//# sourceMappingURL=seed.d.ts.map