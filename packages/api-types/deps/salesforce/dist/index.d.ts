export * from './types.js';
export * from './adapter.js';
import type { AppMode } from '@partnerforge/shared';
import { type SalesforceAdapter } from './adapter.js';
/**
 * Mode-aware Salesforce adapter. `demo` → in-memory mock; `live` → real
 * connector (throws until configured). Real connector is a one-line swap in
 * `liveAdapter()` once Progress provides API access.
 *
 * Dev escape hatch: set `SF_USE_MOCK_IN_LIVE=true` to wire the mock to the
 * live path. This lets us exercise the SF-source-of-truth cache flow
 * end-to-end against fake data while waiting for real org credentials.
 * Never set this in a customer deployment — it silently hides "SF is down".
 */
export declare function getSalesforce(mode?: AppMode): SalesforceAdapter;
