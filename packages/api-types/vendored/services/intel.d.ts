import { type DbConnection } from '@partnerforge/db';
import type { SalesforceAdapter } from '@partnerforge/salesforce';
import type { Logger } from '../logger.js';
export interface IntelOptions {
    sf?: SalesforceAdapter;
    log?: Logger;
}
export declare function computeEngagement(db: DbConnection, partnerId: string): {
    engagement: number;
    churnRisk: number;
};
export declare function refreshAllEngagement(db: DbConnection, opts?: IntelOptions): Promise<number>;
export declare function generatePartnerInsight(db: DbConnection, partnerId: string): Promise<void>;
export declare function generateAllInsights(db: DbConnection, opts?: IntelOptions): Promise<number>;
export declare function detectConflicts(db: DbConnection, dealId: string): Promise<number>;
export declare function scanAllConflicts(db: DbConnection, opts?: IntelOptions): Promise<number>;
