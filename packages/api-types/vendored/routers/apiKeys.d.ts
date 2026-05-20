import { z } from 'zod';
/**
 * API-key administration. Admin-only. Keys authenticate non-browser consumers
 * (MCP server, jobs, third-party integrators) via the `X-Api-Key` header.
 * The plaintext key is shown to the creator exactly once — only the SHA-256
 * hash is stored.
 */
export declare const apiKeysRouter: import("@trpc/server").TRPCBuiltRouter<{
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
        input: void;
        output: {
            id: string;
            name: string;
            prefix: string;
            scopes: string[];
            createdBy: string;
            createdAt: string;
            lastUsedAt: string | null;
            revokedAt: string | null;
        }[];
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            scopes?: string[] | undefined;
        };
        output: {
            id: string;
            name: string;
            prefix: string;
            scopes: string[];
            plaintext: string;
        };
        meta: object;
    }>;
    revoke: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            revokedAt: string;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=apiKeys.d.ts.map