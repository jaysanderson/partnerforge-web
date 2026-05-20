export declare const commissionsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    payouts: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: import("@partnerforge/shared").PayoutStatus;
            partnerId: string;
            id: string;
            createdAt: string;
            currency: string;
            updatedAt: string;
            dealId: string | null;
            amount: number;
            planId: string | null;
            period: string;
        }[];
        meta: object;
    }>;
    /** Recompute payouts from won deals at the partner's tier rate. */
    recompute: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            created: number;
        };
        meta: object;
    }>;
}>>;
