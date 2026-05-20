import { z } from 'zod';
/**
 * Task management — used by partner managers, the AI assistant ("create task"
 * intents), and integrators (MCP `create_task` / `list_tasks`). Reads accept
 * internal users with partners:read OR a service key with partners:read;
 * writes require partners:update (orthogonal: admin scope `partners:write`).
 */
export declare const tasksRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            status?: "open" | "in_progress" | "done" | "cancelled" | undefined;
            partnerId?: string | undefined;
        } | undefined;
        output: {
            status: import("@partnerforge/shared").TaskStatus;
            partnerId: string | null;
            id: string;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            title: string;
            completedAt: string | null;
            assigneeId: string | null;
            assigneeType: string | null;
            priority: import("@partnerforge/shared").TaskPriority;
            dueDate: string | null;
        }[];
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            status: import("@partnerforge/shared").TaskStatus;
            partnerId: string | null;
            id: string;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            title: string;
            completedAt: string | null;
            assigneeId: string | null;
            assigneeType: string | null;
            priority: import("@partnerforge/shared").TaskPriority;
            dueDate: string | null;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            title: string;
            partnerId?: string | undefined;
            description?: string | undefined;
            assigneeId?: string | undefined;
            assigneeType?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
        };
        output: {
            id: string;
            partnerId: string | null;
            assigneeId: string | null;
            assigneeType: string | null;
            title: string;
            description: string | null;
            status: "open";
            priority: "low" | "medium" | "high" | "urgent";
            dueDate: string | null;
            createdAt: string;
            updatedAt: string;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            status?: "open" | "in_progress" | "done" | "cancelled" | undefined;
            description?: string | undefined;
            title?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
        };
        output: {
            status: import("@partnerforge/shared").TaskStatus;
            partnerId: string | null;
            id: string;
            createdAt: string;
            description: string | null;
            updatedAt: string;
            title: string;
            completedAt: string | null;
            assigneeId: string | null;
            assigneeType: string | null;
            priority: import("@partnerforge/shared").TaskPriority;
            dueDate: string | null;
        } | undefined;
        meta: object;
    }>;
}>>;
