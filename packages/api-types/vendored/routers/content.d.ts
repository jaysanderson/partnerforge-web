import { z } from 'zod';
export declare const contentRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            status?: string | undefined;
            type?: string | undefined;
        } | undefined;
        output: {
            status: import("@partnerforge/shared").ContentStatus;
            type: string;
            id: string;
            createdBy: string | null;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            deletedAt: string | null;
            title: string;
            fileUrl: string | null;
            thumbnailUrl: string | null;
            aragResourceId: string | null;
            aragKbName: "enablement" | "video";
            mediaType: "link" | "video" | "document";
            durationSeconds: number | null;
            transcriptStatus: "pending" | "processing" | "ready" | "failed" | null;
            labels: import("@partnerforge/shared").LabelAssignment[];
            tierAccess: string[];
        }[];
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            status: import("@partnerforge/shared").ContentStatus;
            type: string;
            id: string;
            createdBy: string | null;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            deletedAt: string | null;
            title: string;
            fileUrl: string | null;
            thumbnailUrl: string | null;
            aragResourceId: string | null;
            aragKbName: "enablement" | "video";
            mediaType: "link" | "video" | "document";
            durationSeconds: number | null;
            transcriptStatus: "pending" | "processing" | "ready" | "failed" | null;
            labels: import("@partnerforge/shared").LabelAssignment[];
            tierAccess: string[];
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            type: "Battle Card" | "Case Study" | "Pricing Sheet" | "Product Overview" | "Training Module" | "Webinar" | "Template" | "Sales Playbook" | "ROI Tool" | "Data Sheet" | "Solution Brief" | "Demo Script";
            title: string;
            description?: string | undefined;
            fileUrl?: string | undefined;
            labels?: {
                value: string;
                set: string;
            }[] | undefined;
            tierAccess?: ("Registered" | "Silver" | "Gold" | "Platinum" | "Strategic")[] | undefined;
        };
        output: {
            status: "draft";
            createdBy: string;
            createdAt: string;
            updatedAt: string;
            type: "Battle Card" | "Case Study" | "Pricing Sheet" | "Product Overview" | "Training Module" | "Webinar" | "Template" | "Sales Playbook" | "ROI Tool" | "Data Sheet" | "Solution Brief" | "Demo Script";
            title: string;
            labels: {
                value: string;
                set: string;
            }[];
            tierAccess: ("Registered" | "Silver" | "Gold" | "Platinum" | "Strategic")[];
            description?: string | undefined;
            fileUrl?: string | undefined;
            id: string;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            type?: "Battle Card" | "Case Study" | "Pricing Sheet" | "Product Overview" | "Training Module" | "Webinar" | "Template" | "Sales Playbook" | "ROI Tool" | "Data Sheet" | "Solution Brief" | "Demo Script" | undefined;
            description?: string | undefined;
            title?: string | undefined;
            fileUrl?: string | undefined;
            labels?: {
                value: string;
                set: string;
            }[] | undefined;
            tierAccess?: ("Registered" | "Silver" | "Gold" | "Platinum" | "Strategic")[] | undefined;
        };
        output: {
            status: import("@partnerforge/shared").ContentStatus;
            type: string;
            id: string;
            createdBy: string | null;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            deletedAt: string | null;
            title: string;
            fileUrl: string | null;
            thumbnailUrl: string | null;
            aragResourceId: string | null;
            aragKbName: "enablement" | "video";
            mediaType: "link" | "video" | "document";
            durationSeconds: number | null;
            transcriptStatus: "pending" | "processing" | "ready" | "failed" | null;
            labels: import("@partnerforge/shared").LabelAssignment[];
            tierAccess: string[];
        } | undefined;
        meta: object;
    }>;
    publish: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            publish: boolean;
        };
        output: {
            id: string;
            status: string;
        };
        meta: object;
    }>;
    remove: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            deleted: boolean;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=content.d.ts.map