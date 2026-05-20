/**
 * Salesforce read-through cache primitives. The Salesforce adapter is the
 * canonical source for "shared CRM entities" (Account, Contact, Opportunity);
 * the local DB tables for partners / partner_contacts / deals become a typed
 * cache layer.
 *
 * This module is intentionally **just primitives** — no per-entity logic. The
 * routers (PR_SF2 / PR_SF3) call these helpers from inside their own
 * cache-aside loops, because the merge from SF shape → cache row is
 * entity-specific (partners have PartnerForge-only fields like
 * engagementScore that must not be clobbered on refresh).
 *
 * The contract:
 *   1. Reads check `isStale(row.lastSyncedFromSf, ttl)`.
 *   2. If stale and `shouldUseCache(mode)`, fetch from SF, merge into the row,
 *      stamp `markFresh()` into `lastSyncedFromSf`, write back to DB.
 *   3. In demo mode `shouldUseCache` returns false — the mock adapter is
 *      already in-memory and free, so we just call it on every read.
 *   4. Writes always go SF-first (adapter mutator), then the cache row is
 *      replaced from the SF response (using `markFresh()`).
 */
import type { AppMode } from '@partnerforge/shared';
/**
 * Default TTLs in seconds. Tunable via Portal Settings in PR_SF4; for now
 * hard-coded here.
 *  - `single`: getAccount / getOpportunity by id — short TTL so detail pages
 *    feel live (60 s).
 *  - `list`: listAccounts / listAllOpportunities — longer TTL since list
 *    pages are heavier to refresh and tolerate a few minutes of staleness
 *    (300 s).
 */
export declare const CACHE_TTL: {
    readonly single: 60;
    readonly list: 300;
};
/**
 * True if the cache row is missing or older than `ttlSec`. Treat
 * `null`/`undefined`/`''` as "never synced" (always stale).
 */
export declare function isStale(lastSyncedFromSf: string | null | undefined, ttlSec: number): boolean;
/**
 * Whether to consult the cache layer at all. In `demo` mode the mock adapter
 * is in-memory and free, so we bypass the cache and call the adapter on every
 * read — keeps demo behaviour unchanged and avoids the cache hiding mock-data
 * mutations during a sales demo.
 */
export declare function shouldUseCache(mode: AppMode): boolean;
/** ISO 8601 timestamp to stamp into a freshly-refreshed cache row. */
export declare function markFresh(): string;
/** Convenience: number of seconds since the cache row was refreshed. */
export declare function ageSeconds(lastSyncedFromSf: string | null | undefined): number | null;
