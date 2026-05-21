import { z } from 'zod';
import type { SharePointAsset } from '@partnerforge/sharepoint';
import type { Context } from '../context.js';
/**
 * Narrow no-code admin configuration (R131–R138). Business admins change
 * partner-facing field labels/visibility and the brand-asset surface
 * without engineering; changes apply live (read by sf.fieldMeta / portal).
 * Backed by the existing key/value `config` table.
 *
 * Brand assets live in Progress's SharePoint; the platform surfaces them as
 * governed links/embeds (R2) — no asset re-hosting.
 */
export declare const CONFIG_KEYS: {
    readonly oppFieldOverrides: "ui.opportunityFieldOverrides";
    readonly sharepointAssets: "content.sharepointAssets";
    readonly useMockInLive: "sf.useMockInLive";
    readonly integration: "sf.integration";
    /** Server-only: OAuth tokens. NEVER returned to the browser. */
    readonly oauth: "sf.oauth";
    /** Connected App creds (clientId/clientSecret/loginUrl). Secret never
     *  returned to the browser. */
    readonly connectedApp: "sf.connectedApp";
    /** Server-only: in-flight OAuth handshake (state + PKCE verifier +
     *  environment + redirectUri). Created on start, consumed on complete. */
    readonly oauthPending: "sf.oauthPending";
};
export interface OppFieldOverride {
    apiName: string;
    partnerLabel?: string;
    visibleToPartner?: boolean;
}
export type { SharePointAsset };
/** The Salesforce integration config (the wizard's persisted state). Tokens
 *  live separately under `sf.oauth` and are never part of this shape. */
export interface SfIntegration {
    status: 'not_connected' | 'connected' | 'paused';
    connection: {
        environment: 'production' | 'sandbox' | null;
        instanceUrl: string | null;
        orgName: string | null;
        connectedAt: string | null;
        connectedBy: string | null;
        /** Set when the wizard is finished (Activate). null = OAuth done but
         *  setup still in progress → the hub keeps showing the wizard. */
        activatedAt: string | null;
        /** Whether a real Connected App is wired (vs the simulated provider). */
        real: boolean;
    };
    objects: {
        accounts: {
            enabled: boolean;
            filter: string;
        };
        contacts: {
            enabled: boolean;
        };
        opportunities: {
            enabled: boolean;
            filter: string;
        };
    };
    fieldMappings: {
        account: {
            sfField: string;
            pfField: string;
        }[];
        contact: {
            sfField: string;
            pfField: string;
        }[];
        opportunity: {
            sfField: string;
            pfField: string;
        }[];
    };
    sync: {
        direction: 'inbound' | 'bidirectional';
        frequency: 'hourly' | 'every_4h' | 'daily' | 'manual';
        conflictPolicy: 'sf_wins' | 'pf_wins' | 'review';
    };
}
export declare const DEFAULT_INTEGRATION: SfIntegration;
export declare function readConfig<T>(ctx: Context, key: string, fallback: T): T;
export declare const adminConfigRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: Context;
    meta: object;
    errorShape: {
        data: {
            code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "GATEWAY_TIMEOUT" | "UNAUTHORIZED" | "PAYMENT_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE" | "UNPROCESSABLE_CONTENT" | "PRECONDITION_REQUIRED" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
            message: string;
            details: z.typeToFlattenedError<any, string> | undefined;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    /** Partner-facing brand assets, served through the SharePoint adapter. */
    sharepointAssets: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: SharePointAsset[];
        meta: object;
    }>;
    /** Effective runtime mode (public — drives the DEMO/LIVE badge). */
    mode: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            mode: import("@partnerforge/shared").AppMode;
        };
        meta: object;
    }>;
    setMode: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            mode: "demo" | "live";
        };
        output: {
            mode: "demo" | "live";
        };
        meta: object;
    }>;
    /**
     * Redacted snapshot of the current Salesforce configuration. Lets the
     * Console show what's wired without ever exposing credential values.
     * Admin-only (internal procedure) — knowing which env vars are set is
     * still sensitive operational metadata.
     */
    salesforceConfig: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            mode: import("@partnerforge/shared").AppMode;
            useMockInLive: boolean;
            envPresent: {
                baseUrl: boolean;
                username: boolean;
                password: boolean;
            };
            connector: "mock" | "live-stub" | "live-real";
        };
        meta: object;
    }>;
    /**
     * Persist the `sf.useMockInLive` override. Beats the
     * `SF_USE_MOCK_IN_LIVE` env default at runtime, no restart needed. The
     * cron + every tRPC request re-read this row on each invocation through
     * `resolveUseMockInLive(db)`.
     */
    setUseMockInLive: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            value: boolean;
        };
        output: {
            useMockInLive: boolean;
        };
        meta: object;
    }>;
    /**
     * Probe the currently-resolved Salesforce adapter. In `mock` /
     * `live-stub` configurations this returns immediately (the stub would
     * throw on any call) — the Console uses it as a smoke test that the
     * connector wiring is wired correctly. When the real Live connector
     * lands, this will do a 5s-timeout `getAccount('prt_northwind')`
     * round-trip and report the latency.
     */
    testSalesforceConnection: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            ok: true;
            kind: "mock";
            latencyMs: number;
            errorMessage?: undefined;
        } | {
            ok: false;
            kind: "live-stub";
            errorMessage: string;
            latencyMs?: undefined;
        } | {
            ok: true;
            kind: "live-real";
            latencyMs: number;
            errorMessage?: undefined;
        } | {
            ok: false;
            kind: "live-real";
            latencyMs: number;
            errorMessage: string;
        };
        meta: object;
    }>;
    /** The full integration config (redacted — tokens live under sf.oauth and
     *  are never returned). Drives the "Connect to Salesforce" wizard + hub. */
    salesforceIntegration: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: SfIntegration;
        meta: object;
    }>;
    /** Connected App status (redacted — never returns the secret). */
    salesforceConnectedApp: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            configured: boolean;
            source: "env" | "app" | "none";
            loginUrl: string;
            clientIdLast4: string;
        };
        meta: object;
    }>;
    /** Save the Connected App creds (entered in-app). Lets you connect a real
     *  org without redeploying or shelling in secrets. */
    setSalesforceConnectedApp: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            clientId: string;
            clientSecret: string;
            loginUrl?: string | undefined;
        };
        output: {
            configured: boolean;
        };
        meta: object;
    }>;
    /** Step 1a — begin OAuth. Returns the Salesforce authorize URL (real) or a
     *  simulated in-app callback URL. `redirectUri` is the web callback;
     *  ignored in favour of the registered server callback when a real
     *  Connected App is configured. */
    salesforceOAuthStart: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            environment: "production" | "sandbox";
            redirectUri: string;
        };
        output: {
            authorizeUrl: string;
            simulated: boolean;
            state: string;
        };
        meta: object;
    }>;
    /** Step 1b — complete OAuth. Looks up the in-flight handshake by `state`,
     *  exchanges the code with PKCE, and persists the connection + tokens
     *  (tokens under the server-only sf.oauth key, never returned). */
    salesforceOAuthComplete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            code?: string | undefined;
            state?: string | undefined;
        };
        output: SfIntegration;
        meta: object;
    }>;
    /** Disconnect — clears the connection + tokens, resets to not_connected. */
    salesforceDisconnect: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: SfIntegration;
        meta: object;
    }>;
    /** Step 3 — SF field metadata for the mapping UI. */
    salesforceDescribe: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            object: "account" | "contact" | "opportunity";
        };
        output: {
            object: "account" | "contact" | "opportunity";
            fields: import("@partnerforge/salesforce").SfDescribeField[];
        };
        meta: object;
    }>;
    /** Steps 2-4 — merge a partial config (objects / fieldMappings / sync). */
    patchSalesforceIntegration: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            sync?: {
                direction?: "inbound" | "bidirectional" | undefined;
                frequency?: "hourly" | "every_4h" | "daily" | "manual" | undefined;
                conflictPolicy?: "sf_wins" | "pf_wins" | "review" | undefined;
            } | undefined;
            objects?: {
                accounts?: {
                    filter: string;
                    enabled: boolean;
                } | undefined;
                contacts?: {
                    enabled: boolean;
                } | undefined;
                opportunities?: {
                    filter: string;
                    enabled: boolean;
                } | undefined;
            } | undefined;
            fieldMappings?: {
                account?: {
                    sfField: string;
                    pfField: string;
                }[] | undefined;
                contact?: {
                    sfField: string;
                    pfField: string;
                }[] | undefined;
                opportunity?: {
                    sfField: string;
                    pfField: string;
                }[] | undefined;
            } | undefined;
        };
        output: SfIntegration;
        meta: object;
    }>;
    /** Step 5 — dry-run preview: how many records the enabled objects import. */
    salesforcePreview: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            accounts: number;
            opportunities: number;
            contacts: number;
        };
        meta: object;
    }>;
    /**
     * Activate — finish setup + kick the initial sync. For a REAL connection
     * (a live org, not the simulated demo provider), this is the "off to the
     * races" switch: purge the demo data, flip the platform to Live, and pull
     * the real org via the live connector.
     */
    activateSalesforceIntegration: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: SfIntegration;
        meta: object;
    }>;
    /**
     * Reset to demo data — purge everything Salesforce-mirrored, re-seed the
     * demo dataset, disconnect, and flip back to Demo mode. The one-click
     * "back to the sandbox demo" escape hatch after going live.
     */
    resetToDemoData: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            ok: boolean;
        };
        meta: object;
    }>;
    oppFieldOverrides: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: OppFieldOverride[];
        meta: object;
    }>;
    setOppFieldOverrides: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            apiName: string;
            partnerLabel?: string | undefined;
            visibleToPartner?: boolean | undefined;
        }[];
        output: {
            ok: boolean;
            count: number;
        };
        meta: object;
    }>;
    setSharepointAssets: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            region: string;
            title: string;
            productFamily: string;
            url: string;
        }[];
        output: {
            ok: boolean;
            count: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=adminConfig.d.ts.map