import { z } from 'zod';
/**
 * System / orchestration. Service principals invoke via `X-Api-Key` with the
 * matching scope; internal admins can also trigger manually (console buttons).
 * All long-running ops are coalesced — overlapping triggers join one run.
 */
export declare const systemRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").Context;
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
    syncRunAll: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: import("../services/sync.js").SyncSummary;
        meta: object;
    }>;
    intelRefreshEngagement: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            partners: number;
        };
        meta: object;
    }>;
    intelGenerateInsights: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            partners: number;
        };
        meta: object;
    }>;
    intelScanConflicts: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            flagged: number;
        };
        meta: object;
    }>;
    aragSetupLabelsets: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: import("../services/aragSetup.js").AragSetupReport;
        meta: object;
    }>;
    /**
     * Freshness snapshot of the Salesforce read-through cache. Returns, per
     * entity, the row counts (total / synced from SF) and the oldest sync
     * timestamp. The UI uses this to surface "Partners cache: N rows,
     * oldest M min ago" + the "Refresh from Salesforce" buttons.
     */
    cacheStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            partners: {
                total: number;
                synced: number;
                oldestSync: string | null;
            };
            deals: {
                total: number;
                synced: number;
                oldestSync: string | null;
            };
            partnerContacts: {
                total: number;
                synced: number;
                oldestSync: string | null;
            };
        };
        meta: object;
    }>;
    /**
     * Invalidate the Salesforce read-through cache. Clears `lastSyncedFromSf`
     * on the chosen entity's local rows; the next read will treat them as
     * stale and re-fetch from SF (via the adapter).
     *
     * Used by the Operations panel "Refresh from Salesforce" buttons (PR_SF4)
     * and by service automations that know SF data has changed.
     */
    cacheRefresh: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            entity?: "partner" | "all" | "contact" | "opportunity" | undefined;
        };
        output: {
            entity: "partner" | "all" | "contact" | "opportunity";
            cleared: Record<string, number>;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=system.d.ts.map