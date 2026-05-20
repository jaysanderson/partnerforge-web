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
 * Effective runtime mode. Admin config override (system.mode) wins, then
 * APP_MODE env, then `demo`. Demo = mock connectors; Live = real connectors
 * that fail loudly when unconfigured.
 */
export declare function resolveMode(ctx: Context): AppMode;
/** Mode-aware Salesforce adapter for this request. */
export declare function sfFor(ctx: Context): SalesforceAdapter;
/** Mode-aware SharePoint adapter, backed by admin config in demo mode. */
export declare function sharePointFor(ctx: Context, read: () => SharePointAsset[]): SharePointAdapter;
//# sourceMappingURL=mode.d.ts.map