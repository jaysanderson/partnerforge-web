import { z } from 'zod';
type Finding = {
    kind: string;
    detail: string;
    matchId?: string;
    confidence?: number;
};
export declare const submissionsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    /** Form definitions (server-authoritative). */
    forms: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("../forms.js").FormDef[];
        meta: object;
    }>;
    mine: import("@trpc/server").TRPCQueryProcedure<{
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
    submit: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            values: Record<string, unknown>;
            type: string;
        };
        output: {
            id: string;
            status: "pending" | "auto_approved";
            findings: Finding[];
            recommendation: "create" | "update" | "reject";
            sfRecordId: string | null;
        };
        meta: object;
    }>;
}>>;
export {};
//# sourceMappingURL=submissions.d.ts.map