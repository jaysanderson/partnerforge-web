/**
 * Pre-built reports. All aggregations run over live operational data.
 * Uses `permissionOrScope` so non-browser integrators with `reports:read`
 * can pull aggregates via the REST surface (e.g. a BI tool, Power Automate).
 */
export declare const reportsRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../context.js").Context;
    meta: object;
    errorShape: {
        data: {
            code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "BAD_GATEWAY" | "SERVICE_UNAVAILABLE" | "GATEWAY_TIMEOUT" | "UNAUTHORIZED" | "PAYMENT_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE" | "UNPROCESSABLE_CONTENT" | "PRECONDITION_REQUIRED" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
            message: string;
            details: import("zod").typeToFlattenedError<any, string> | undefined;
        };
        message: string;
        code: import("@trpc/server").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    pipeline: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            byStage: Record<string, {
                count: number;
                value: number;
            }>;
            byProduct: Record<string, {
                count: number;
                value: number;
            }>;
            byRegion: Record<string, {
                count: number;
                value: number;
            }>;
            total: number;
        };
        meta: object;
    }>;
    revenueAttribution: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            partnerSourced: number;
            openPipeline: number;
            wonCount: number;
        };
        meta: object;
    }>;
    partnerScorecard: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            partner: string;
            tier: string;
            engagement: number;
            churnRisk: number;
            openPipeline: number;
            closedRevenue: number;
        }[];
        meta: object;
    }>;
    contentEffectiveness: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            title: string;
            type: string;
            status: import("@partnerforge/shared").ContentStatus;
            views: number;
        }[];
        meta: object;
    }>;
    programHealth: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            totalPartners: number;
            byTier: Record<string, number>;
            avgEngagement: number;
            certificationsCompleted: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=reports.d.ts.map