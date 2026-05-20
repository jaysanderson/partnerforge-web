export declare const trainingRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    courses: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: import("@partnerforge/shared").ContentStatus;
            id: string;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            deletedAt: string | null;
            title: string;
            thumbnailUrl: string | null;
            aragResourceId: string | null;
            modules: unknown[];
            estimatedMinutes: number | null;
        }[];
        meta: object;
    }>;
    certifications: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            contactName: string | null;
            partnerName: string | null;
            partnerId: string | null;
            courseTitle: string | null;
            status: import("@partnerforge/shared").CertificationStatus;
            id: string;
            createdAt: string;
            partnerContactId: string;
            courseId: string;
            score: number | null;
            completedAt: string | null;
            expiresAt: string | null;
            certificateUrl: string | null;
        }[];
        meta: object;
    }>;
}>>;
//# sourceMappingURL=training.d.ts.map