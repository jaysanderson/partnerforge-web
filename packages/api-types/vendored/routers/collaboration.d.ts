import { z } from 'zod';
export declare const collaborationRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            recordType: string;
            recordId: string;
        };
        output: {
            id: string;
            createdAt: string;
            accountId: string;
            recordType: string;
            recordId: string;
            body: string;
            authorType: string;
            authorId: string;
            authorName: string;
            mentions: string[];
            syncedToSf: boolean;
        }[];
        meta: object;
    }>;
    add: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            recordType: string;
            recordId: string;
            body: string;
        };
        output: {
            id: string;
            mentions: string[];
            syncedToSf: boolean;
        };
        meta: object;
    }>;
}>>;
