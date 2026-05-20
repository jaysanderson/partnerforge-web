/**
 * SharePoint asset adapter. Progress hosts partner brand/sales assets in
 * SharePoint; PartnerForge surfaces them as governed links/embeds (R2) — it
 * never re-hosts files. Same pattern as @partnerforge/salesforce: a typed
 * contract with a mock implementation today, swapped for a real Microsoft
 * Graph connector when Progress provides app registration / creds.
 */
/** A SharePoint-hosted asset surfaced to eligible partners. */
export interface SharePointAsset {
    title: string;
    /** Product family the asset relates to ('All' = any). */
    productFamily: string;
    /** Region the asset is for ('Global' = any). */
    region: string;
    /** SharePoint document/library URL. */
    url: string;
}
export interface SharePointAdapter {
    /** All published partner assets (the API applies partner scoping). */
    listAssets(): Promise<SharePointAsset[]>;
}
/**
 * Mock backed by an injected reader (the admin-editable config store), so
 * no-code edits persist and the package stays free of a DB dependency.
 * The real adapter ignores the reader and calls Graph instead.
 */
export declare class MockSharePointAdapter implements SharePointAdapter {
    private readonly read;
    constructor(read: () => SharePointAsset[]);
    listAssets(): Promise<SharePointAsset[]>;
}
/**
 * Real Microsoft Graph adapter — not yet wired (needs Progress Azure app
 * registration + site/library ids). Implements the same contract so the
 * swap is one line at the call site.
 */
export declare class GraphSharePointAdapter implements SharePointAdapter {
    private readonly cfg;
    constructor(cfg: {
        tenantId: string;
        siteId: string;
        libraryId: string;
        token: string;
    });
    listAssets(): Promise<SharePointAsset[]>;
}
import type { AppMode } from '@partnerforge/shared';
/**
 * Mode-aware SharePoint adapter. `demo` → config-backed mock; `live` → real
 * Microsoft Graph connector, which fails loudly until Azure app credentials
 * are configured (no mock fallback in live).
 */
export declare function getSharePoint(mode: AppMode, read: () => SharePointAsset[]): SharePointAdapter;
/** @deprecated use getSharePoint(mode, read) */
export declare function makeSharePoint(read: () => SharePointAsset[]): SharePointAdapter;
//# sourceMappingURL=index.d.ts.map