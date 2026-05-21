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
};
export interface OppFieldOverride {
    apiName: string;
    partnerLabel?: string;
    visibleToPartner?: boolean;
}
export type { SharePointAsset };
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