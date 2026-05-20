export declare const mdfRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            allocations: {
                partnerName: string;
                partnerId: string;
                id: string;
                campaignId: string;
                mdfAllocated: number;
                mdfSpent: number;
                roiValue: number;
            }[];
            totalAllocated: number;
            totalSpent: number;
            totalRoi: number;
            status: string;
            type: string;
            id: string;
            name: string;
            createdAt: string;
            currency: string;
            updatedAt: string;
            budget: number;
            startDate: string | null;
            endDate: string | null;
        }[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=mdf.d.ts.map