import { z } from 'zod';
export declare const dealsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            partnerId?: string | undefined;
            stage?: string | undefined;
            product?: string | undefined;
            region?: string | undefined;
            businessUnit?: string | undefined;
        } | undefined;
        output: {
            status: import("@partnerforge/shared").DealStatus;
            value: number;
            partnerId: string;
            id: string;
            createdAt: string;
            companyName: string;
            companyDomain: string | null;
            contactName: string | null;
            contactEmail: string | null;
            currency: string;
            stage: string;
            healthScore: number | null;
            product: string | null;
            industry: string | null;
            region: string | null;
            crmId: string | null;
            registeredAt: string | null;
            closedAt: string | null;
            metadata: Record<string, unknown> | null;
            lastSyncedFromSf: string | null;
            updatedAt: string;
            deletedAt: string | null;
        }[];
        meta: object;
    }>;
    conflicts: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            status: import("@partnerforge/shared").ConflictStatus;
            id: string;
            createdAt: string;
            dealId: string;
            conflictingDealId: string;
            confidenceScore: number;
            resolutionNotes: string | null;
            resolvedBy: string | null;
            resolvedAt: string | null;
        }[];
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            notes: {
                id: string;
                createdAt: string;
                updatedAt: string;
                dealId: string;
                content: string;
                authorType: string;
                authorId: string;
            }[];
            status: import("@partnerforge/shared").DealStatus;
            value: number;
            partnerId: string;
            id: string;
            createdAt: string;
            companyName: string;
            companyDomain: string | null;
            contactName: string | null;
            contactEmail: string | null;
            currency: string;
            stage: string;
            healthScore: number | null;
            product: string | null;
            industry: string | null;
            region: string | null;
            crmId: string | null;
            registeredAt: string | null;
            closedAt: string | null;
            metadata: Record<string, unknown> | null;
            lastSyncedFromSf: string | null;
            updatedAt: string;
            deletedAt: string | null;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            partnerId: string;
            companyName: string;
            value?: number | undefined;
            companyDomain?: string | undefined;
            contactName?: string | undefined;
            contactEmail?: string | undefined;
            currency?: string | undefined;
            stage?: "Registered" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost" | undefined;
            product?: string | undefined;
            industry?: string | undefined;
            region?: string | undefined;
        };
        output: {
            conflictsFlagged: number;
            status?: import("@partnerforge/shared").DealStatus | undefined;
            value?: number | undefined;
            partnerId?: string | undefined;
            id?: string | undefined;
            createdAt?: string | undefined;
            companyName?: string | undefined;
            companyDomain?: string | null | undefined;
            contactName?: string | null | undefined;
            contactEmail?: string | null | undefined;
            currency?: string | undefined;
            stage?: string | undefined;
            healthScore?: number | null | undefined;
            product?: string | null | undefined;
            industry?: string | null | undefined;
            region?: string | null | undefined;
            crmId?: string | null | undefined;
            registeredAt?: string | null | undefined;
            closedAt?: string | null | undefined;
            metadata?: Record<string, unknown> | null | undefined;
            lastSyncedFromSf?: string | null | undefined;
            updatedAt?: string | undefined;
            deletedAt?: string | null | undefined;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            value?: number | undefined;
            partnerId?: string | undefined;
            companyName?: string | undefined;
            companyDomain?: string | undefined;
            contactName?: string | undefined;
            contactEmail?: string | undefined;
            currency?: string | undefined;
            stage?: string | undefined;
            product?: string | undefined;
            industry?: string | undefined;
            region?: string | undefined;
        };
        output: {
            status: import("@partnerforge/shared").DealStatus;
            value: number;
            partnerId: string;
            id: string;
            createdAt: string;
            companyName: string;
            companyDomain: string | null;
            contactName: string | null;
            contactEmail: string | null;
            currency: string;
            stage: string;
            healthScore: number | null;
            product: string | null;
            industry: string | null;
            region: string | null;
            crmId: string | null;
            registeredAt: string | null;
            closedAt: string | null;
            metadata: Record<string, unknown> | null;
            lastSyncedFromSf: string | null;
            updatedAt: string;
            deletedAt: string | null;
        } | undefined;
        meta: object;
    }>;
    addNote: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            dealId: string;
            content: string;
        };
        output: {
            id: string;
            dealId: string;
            authorId: string;
            authorType: "internal" | "partner" | "service";
            content: string;
            createdAt: string;
            updatedAt: string;
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
//# sourceMappingURL=deals.d.ts.map