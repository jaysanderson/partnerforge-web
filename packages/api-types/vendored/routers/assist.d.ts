import { z } from 'zod';
export declare const assistRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    parse: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            message: string;
        };
        output: {
            ok: false;
            error: string;
            raw?: undefined;
            formType?: undefined;
            title?: undefined;
            values?: undefined;
            missing?: undefined;
            followUp?: undefined;
        } | {
            ok: false;
            error: string;
            raw: string;
            formType?: undefined;
            title?: undefined;
            values?: undefined;
            missing?: undefined;
            followUp?: undefined;
        } | {
            ok: true;
            formType: string;
            title: string;
            values: Record<string, unknown>;
            missing: string[];
            followUp: string;
            error?: undefined;
            raw?: undefined;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=assist.d.ts.map