import { z } from 'zod';
/**
 * Partners API. Salesforce's `Account` is the source of truth for the
 * SF-canonical fields (name / domain / tier / type / region); the local
 * `partners` table is a read-through cache that also holds PartnerForge-only
 * fields (status, engagementScore, ownerUserId, …).
 *
 * Read paths: in `live` mode they trigger a stale-cache refresh from SF
 * before serving from the local DB. In `demo` mode the local DB is the
 * source — no SF calls — so the seeded data drives the experience.
 *
 * Write paths: in `live` mode all create/update flow SF-first, then the
 * SF response merges back into the cache. In `demo` mode writes stay local
 * (the mock adapter is in-memory; persistence stops when the process does).
 */
export declare const partnersRouter: import("@trpc/server").TRPCBuiltRouter<{
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
            region?: string | undefined;
            tier?: string | undefined;
        } | undefined;
        output: {
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
        }[];
        meta: object;
    }>;
    get: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
    }>;
    /** Full profile bundle — partner + their deals (used by MCP get_partner_details). */
    getDetailed: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            deals: {
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
            contacts: {
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
            }[];
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
        meta: object;
    }>;
    /** Performance metrics + pipeline for a single partner (MCP scorecard). */
    scorecard: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            partner: string;
            tier: string;
            engagementScore: number;
            churnRiskScore: number;
            openPipeline: number;
            closedRevenue: number;
            dealCount: number;
        };
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            type: "Reseller" | "SI" | "ISV" | "Referral" | "Technology" | "Distribution" | "Consulting";
            name: string;
            region: "North America" | "EMEA" | "APAC" | "LATAM" | "ANZ";
            tier: "Registered" | "Silver" | "Gold" | "Platinum" | "Strategic";
            domain?: string | undefined;
            primaryContactName?: string | undefined;
            primaryContactEmail?: string | undefined;
            ownerUserId?: string | undefined;
        };
        output: {
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
        } | {
            status: "onboarding";
            engagementScore: number;
            churnRiskScore: number;
            createdAt: string;
            updatedAt: string;
            type: "Reseller" | "SI" | "ISV" | "Referral" | "Technology" | "Distribution" | "Consulting";
            name: string;
            region: "North America" | "EMEA" | "APAC" | "LATAM" | "ANZ";
            tier: "Registered" | "Silver" | "Gold" | "Platinum" | "Strategic";
            domain?: string | undefined;
            primaryContactName?: string | undefined;
            primaryContactEmail?: string | undefined;
            ownerUserId?: string | undefined;
            id: string;
        } | undefined;
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            type?: "Reseller" | "SI" | "ISV" | "Referral" | "Technology" | "Distribution" | "Consulting" | undefined;
            name?: string | undefined;
            region?: "North America" | "EMEA" | "APAC" | "LATAM" | "ANZ" | undefined;
            domain?: string | undefined;
            tier?: "Registered" | "Silver" | "Gold" | "Platinum" | "Strategic" | undefined;
            primaryContactName?: string | undefined;
            primaryContactEmail?: string | undefined;
            ownerUserId?: string | undefined;
        };
        output: {
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
        } | undefined;
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
//# sourceMappingURL=partners.d.ts.map