import { type SalesforceAdapter } from '@partnerforge/salesforce';
import { type SharePointAsset, type SharePointAdapter } from '@partnerforge/sharepoint';
import type { AppMode } from '@partnerforge/shared';
import { type DbConnection } from '@partnerforge/db';
import type { Env } from './env.js';
import type { Context } from './context.js';
/**
 * Resolve mode from a raw `db`/`env` pair. Used by code that runs outside
 * of a tRPC request — the cron, services called from CLI scripts, etc.
 * Same priority as `resolveMode(ctx)`: config row, then APP_MODE env.
 */
export declare function resolveModeFromDb(db: DbConnection, env: Env): AppMode;
/**
 * Resolve the persistent `sf.useMockInLive` override. Honoured by
 * `getSalesforce()` when mode is `live` so Console-driven UX demos can
 * pose as Live without a real Salesforce org provisioned.
 *
 * Falls back to the `SF_USE_MOCK_IN_LIVE` env var (boot-time default)
 * when no config row exists.
 */
export declare function resolveUseMockInLive(db: DbConnection): boolean;
/**
 * Effective runtime mode. Admin config override (system.mode) wins, then
 * APP_MODE env, then `demo`. Demo = mock connectors; Live = real connectors
 * that fail loudly when unconfigured.
 */
export declare function resolveMode(ctx: Context): AppMode;
/**
 * Resolve the Salesforce adapter for a raw db/env pair.
 *
 * Order of precedence:
 *  1. A real, activated OAuth connection (a live org) → `LiveSalesforceAdapter`
 *     pointed at that org, regardless of demo/live toggle. This is the
 *     "connected → off to the races" path: the moment a real org is wired,
 *     reads/sync hit it.
 *  2. Otherwise the mode-aware mock / live-stub (demo, or live-with-mock).
 */
export declare function resolveSalesforce(db: DbConnection, env: Env): SalesforceAdapter;
/** Mode-aware Salesforce adapter for this request. */
export declare function sfFor(ctx: Context): SalesforceAdapter;
/** Mode-aware SharePoint adapter, backed by admin config in demo mode. */
export declare function sharePointFor(ctx: Context, read: () => SharePointAsset[]): SharePointAdapter;
//# sourceMappingURL=mode.d.ts.map