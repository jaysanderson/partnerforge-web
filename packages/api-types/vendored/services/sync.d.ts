import { type DbConnection } from '@partnerforge/db';
import type { SalesforceAdapter } from '@partnerforge/salesforce';
import type { Logger } from '../logger.js';
export interface SyncSummary {
    deals: number;
    partners: number;
    content: number;
}
export interface SyncOptions {
    /**
     * When set, the Salesforce cache is refreshed before ARAG mirrors it.
     * Pass `getSalesforce(mode)` from the caller. Omitting `sf` means the
     * function reads whatever's already in the local cache — fine for demo
     * mode or when staleness is acceptable.
     */
    sf?: SalesforceAdapter;
    log?: Logger;
}
export declare function syncAll(db: DbConnection, opts?: SyncOptions): Promise<SyncSummary>;
