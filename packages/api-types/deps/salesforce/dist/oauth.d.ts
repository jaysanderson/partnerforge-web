/**
 * Salesforce OAuth seam for the "Connect to Salesforce" flow.
 *
 * The wizard does a real OAuth round-trip shape — authorize URL → consent →
 * callback → token exchange — but the actual token exchange lives behind this
 * provider so the demo works without a real Connected App, and a real
 * implementation is a single swap.
 *
 * Real mode (when `SALESFORCE_CLIENT_ID` is set): `buildAuthorizeUrl` points
 * at Salesforce's `/services/oauth2/authorize`; `exchangeCode` POSTs to
 * `/services/oauth2/token`. Simulated mode (default in demo): the authorize
 * URL points back at our own callback with `simulated=1`, and `exchangeCode`
 * returns a believable mock org + fake tokens.
 *
 * Tokens never leave the server — callers persist them under the
 * server-only `sf.oauth` config key and never return them to the browser.
 */
export type SfEnvironment = 'production' | 'sandbox';
export interface SfOAuthTokens {
    accessToken: string;
    refreshToken: string;
    issuedAt: string;
}
export interface SfConnectionResult {
    instanceUrl: string;
    orgName: string;
    tokens: SfOAuthTokens;
}
export interface SfOAuthProvider {
    /** True once a real Connected App is configured (vs the simulated stub). */
    isReal(): boolean;
    buildAuthorizeUrl(params: {
        environment: SfEnvironment;
        state: string;
        redirectUri: string;
    }): string;
    exchangeCode(params: {
        environment: SfEnvironment;
        code?: string;
        redirectUri: string;
    }): Promise<SfConnectionResult>;
    /** Exchange a refresh token for a fresh access token (real connector). */
    refresh?(params: {
        environment: SfEnvironment;
        refreshToken: string;
    }): Promise<SfOAuthTokens>;
}
export declare function getSalesforceOAuth(): SfOAuthProvider;
//# sourceMappingURL=oauth.d.ts.map