import { z } from 'zod';
export declare const usersRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            email: string;
            role: string;
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            lastLogin: string | null;
            avatarUrl: string | null;
        }[];
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            email: string;
            role: string;
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            lastLogin: string | null;
            avatarUrl: string | null;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
            name: string;
        };
        output: {
            createdAt: string;
            updatedAt: string;
            email: string;
            role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
            name: string;
            id: string;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            role?: "admin" | "partner_manager" | "sales_engineer" | "read_only" | undefined;
            name?: string | undefined;
        };
        output: {
            email: string;
            role: string;
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            lastLogin: string | null;
            avatarUrl: string | null;
        } | undefined;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=users.d.ts.map