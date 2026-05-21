export type SfEnvironment = 'production' | 'sandbox';
export interface SfPkce {
    verifier: string;
    challenge: string;
}
/** RFC 7636 PKCE pair (S256). Verifier is base64url, challenge = SHA-256(verifier). */
export declare function generatePkce(): SfPkce;
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
        codeChallenge?: string;
    }): string;
    exchangeCode(params: {
        environment: SfEnvironment;
        code?: string;
        redirectUri: string;
        codeVerifier?: string;
    }): Promise<SfConnectionResult>;
    /** Exchange a refresh token for a fresh access token (real connector). */
    refresh?(params: {
        environment: SfEnvironment;
        refreshToken: string;
    }): Promise<SfOAuthTokens>;
}
/** Connected App credentials — entered in-app or via env. */
export interface SfConnectedAppCreds {
    clientId: string;
    clientSecret: string;
    /**
     * The org's My Domain / login host (e.g. `https://acme.my.salesforce.com`
     * or `https://test.salesforce.com`). Modern Connected Apps authorize
     * against My Domain; falls back to login/test.salesforce.com when blank.
     */
    loginUrl?: string;
}
/**
 * Resolve the OAuth provider. Pass in-app Connected App creds (preferred),
 * else fall back to env. With valid creds → real Salesforce OAuth; otherwise
 * the simulated demo provider.
 */
export declare function getSalesforceOAuth(creds?: SfConnectedAppCreds | null): SfOAuthProvider;
//# sourceMappingURL=oauth.d.ts.map