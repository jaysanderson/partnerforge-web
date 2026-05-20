import { z } from 'zod';
/**
 * Partner-portal API. Every procedure is row-level scoped to the caller's
 * own partner — a partner token never returns another partner's data,
 * enforced here (not just the UI).
 */
export declare const portalRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    me: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            partner: {
                status: import("@partnerforge/shared").PartnerStatus;
                type: string;
                id: string;
                name: string;
                createdAt: string;
                region: string;
                crmId: string | null;
                metadata: Record<string, unknown> | null;
                lastSyncedFromSf: string | null;
                updatedAt: string;
                deletedAt: string | null;
                domain: string | null;
                logoUrl: string | null;
                tier: string;
                primaryContactName: string | null;
                primaryContactEmail: string | null;
                engagementScore: number;
                churnRiskScore: number;
                ownerUserId: string | null;
                onboardedAt: string | null;
            };
            contact: {
                email: string;
                role: string | null;
                partnerId: string;
                id: string;
                name: string;
                createdAt: string;
                lastSyncedFromSf: string | null;
                updatedAt: string;
                isPrimary: boolean;
                lastLogin: string | null;
            } | null;
        };
        meta: object;
    }>;
    dashboard: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            pipelineValue: number;
            openCount: number;
            recentDeals: {
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
        };
        meta: object;
    }>;
    deals: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
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
    registerDeal: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            companyName: string;
            value?: number | undefined;
            companyDomain?: string | undefined;
            contactName?: string | undefined;
            contactEmail?: string | undefined;
            product?: string | undefined;
            industry?: string | undefined;
            region?: string | undefined;
        };
        output: {
            id: string;
            conflictsFlagged: number;
        };
        meta: object;
    }>;
    content: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            title: string;
            type: string;
            description: string | null;
        }[];
        meta: object;
    }>;
    /** Semantic content search via ARAG /find (Enablement KB). */
    searchContent: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            query: string;
            limit?: number | undefined;
        };
        output: {
            ok: true;
            hits: import("@partnerforge/arag-client").AragFindHit[];
            error?: undefined;
        } | {
            ok: false;
            hits: never[];
            error: string;
        };
        meta: object;
    }>;
    /** AI partner agent — grounded answer with citations. */
    agentAsk: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            query: string;
            context?: {
                text: string;
                author: "USER" | "ARAG";
            }[] | undefined;
        };
        output: {
            answer: string;
            citations: import("@partnerforge/arag-client").AragCitation[];
            ok: true;
            error?: undefined;
        } | {
            ok: false;
            answer: string;
            citations: never[];
            error: string;
        };
        meta: object;
    }>;
    courses: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            title: string;
            description: string | null;
            estimatedMinutes: number | null;
        }[];
        meta: object;
    }>;
    options: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            products: readonly ["Sitefinity", "OpenEdge", "DataDirect", "MarkLogic", "Chef", "WhatsUp Gold", "MOVEit", "Kemp", "Agentic RAG", "Flowmon"];
            industries: readonly ["Healthcare", "Financial Services", "Cybersecurity", "Manufacturing", "Retail", "Education", "Government", "Technology", "Telecommunications", "Professional Services", "Energy"];
            regions: readonly ["North America", "EMEA", "APAC", "LATAM", "ANZ"];
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=portal.d.ts.map