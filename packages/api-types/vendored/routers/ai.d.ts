import { z } from 'zod';
export declare const aiRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    /** Semantic search via ARAG /find over the chosen KB. */
    search: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            query: string;
            limit?: number | undefined;
            scope?: "partner" | "deal" | "enablement" | undefined;
        };
        output: {
            ok: true;
            hits: import("@partnerforge/arag-client").AragFindHit[];
            error?: undefined;
        } | {
            ok: false;
            hits: never[];
            error: string;
        };
        meta: object;
    }>;
    /** Copilot Q&A with citations. Conversation context passed by the client. */
    ask: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            query: string;
            scope?: "partner" | "deal" | "enablement" | undefined;
            context?: {
                text: string;
                author: "USER" | "ARAG";
            }[] | undefined;
        };
        output: {
            answer: string;
            citations: import("@partnerforge/arag-client").AragCitation[];
            ok: true;
            error?: undefined;
        } | {
            ok: false;
            answer: string;
            citations: never[];
            error: string;
        };
        meta: object;
    }>;
    /** Auto-generate a Quarterly Business Review for a partner via ARAG. */
    generateQbr: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            partnerId: string;
        };
        output: {
            partner: string;
            qbr: string;
            citations: import("@partnerforge/arag-client").AragCitation[];
        };
        meta: object;
    }>;
    /** Non-expired cached insights for a partner (dashboard / detail page). */
    insightsForPartner: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            partnerId: string;
        };
        output: {
            id: string;
            expiresAt: string | null;
            contextType: string;
            contextId: string;
            insightText: string;
            actions: unknown[];
            relevanceScore: number;
            generatedAt: string;
            dismissedBy: string[];
        }[];
        meta: object;
    }>;
    /** Aggregate pipeline value by stage (dashboard chart). */
    pipelineSummary: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            totalValue: number;
            stages: {
                count: number;
                value: number;
                stage: string;
            }[];
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=ai.d.ts.map