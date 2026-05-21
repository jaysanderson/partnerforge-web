export * from './types.js';
export * from './adapter.js';
export * from './oauth.js';
export * from './live.js';
import type { AppMode } from '@partnerforge/shared';
import { type SalesforceAdapter } from './adapter.js';
export interface GetSalesforceOpts {
    /**
     * Persistent runtime override read from the `sf.useMockInLive` config row.
     * When `true`, even `live` mode resolves to the mock adapter — same
     * behaviour as setting the `SF_USE_MOCK_IN_LIVE=true` env var. Lets the
     * Console flip into "Live" for UX demos without a real Salesforce org
     * provisioned.
     */
    useMockInLive?: boolean;
}
/**
 * Mode-aware Salesforce adapter. `demo` → in-memory mock; `live` → real
 * connector (throws until configured). Real connector is a one-line swap in
 * `liveAdapter()` once Progress provides API access.
 *
 * Dev escape hatch order of precedence: explicit `opts.useMockInLive`
 * (the DB-persisted Console toggle) wins; then the `SF_USE_MOCK_IN_LIVE`
 * env var (boot-time default); otherwise live truly means live. Never set
 * either in a customer deployment — both silently hide "SF is down".
 */
export declare function getSalesforce(mode?: AppMode, opts?: GetSalesforceOpts): SalesforceAdapter;
/** True iff a real Salesforce Connected App is configured (Client ID +
 *  Secret present). When true, the OAuth flow hits real Salesforce and a
 *  live connection resolves to `LiveSalesforceAdapter` (see api `sfFor`). */
export declare function liveAdapterIsReal(): boolean;
//# sourceMappingURL=index.d.ts.map