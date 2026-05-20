import { z } from 'zod';
/** Internal submission/approval queue (R102–R110). */
export declare const approvalsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    pending: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: string;
            type: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            accountId: string;
            submittedByContactId: string;
            payload: Record<string, unknown>;
            findings: {
                kind: string;
                detail: string;
                matchId?: string;
                confidence?: number;
            }[];
            recommendation: string | null;
            decidedBy: string | null;
            decidedAt: string | null;
            decisionNotes: string | null;
            sfRecordId: string | null;
        }[];
        meta: object;
    }>;
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: string;
            type: string;
            id: string;
            createdAt: string;
            updatedAt: string;
            accountId: string;
            submittedByContactId: string;
            payload: Record<string, unknown>;
            findings: {
                kind: string;
                detail: string;
                matchId?: string;
                confidence?: number;
            }[];
            recommendation: string | null;
            decidedBy: string | null;
            decidedAt: string | null;
            decisionNotes: string | null;
            sfRecordId: string | null;
        }[];
        meta: object;
    }>;
    decide: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            decision: "approve" | "reject";
            notes?: string | undefined;
        };
        output: {
            id: string;
            status: string;
            sfRecordId: string | null;
        };
        meta: object;
    }>;
}>>;
