import { z } from 'zod';
/**
 * Salesforce-backed partner views. Salesforce is the system of record; every
 * procedure is scoped to the caller's own SF account (== principal.partnerId
 * in the mock). Enforced at both the adapter and this layer (R15/R154).
 */
export declare const sfRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    account: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfAccount;
        meta: object;
    }>;
    /** Field metadata with live no-code admin overrides applied (R28/R29). */
    fieldMeta: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfFieldMeta[];
        meta: object;
    }>;
    opportunities: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            status?: "open" | "won" | "lost" | undefined;
        } | undefined;
        output: import("@partnerforge/salesforce").SfOpportunity[];
        meta: object;
    }>;
    opportunity: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
            quotes: import("@partnerforge/salesforce").SfQuote[];
            id: string;
            accountId: string;
            name: string;
            customerName: string;
            customerDomain: string;
            amount: number;
            currency: string;
            stage: import("@partnerforge/salesforce").OpportunityStage;
            status: import("@partnerforge/salesforce").OpportunityStatus;
            closeDate: string;
            ownerName: string;
            contactName: string | null;
            product: string;
            lineItems: import("@partnerforge/salesforce").SfLineItem[];
            sourceAssetId: string | null;
            createdAt: string;
            updatedAt: string;
        };
        meta: object;
    }>;
    leads: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfLead[];
        meta: object;
    }>;
    assets: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfAsset[];
        meta: object;
    }>;
    quotes: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfQuote[];
        meta: object;
    }>;
    /** Products + pricing the partner is eligible for (R48–R55). */
    catalogue: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            tier: "Registered" | "Silver" | "Gold" | "Platinum" | "Strategic";
            products: import("@partnerforge/salesforce").SfProduct[];
            pricing: import("@partnerforge/salesforce").SfPriceEntry[];
        };
        meta: object;
    }>;
    picklists: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: import("@partnerforge/salesforce").SfPicklistMetadata;
        meta: object;
    }>;
    /** Register an opportunity (basic create; dedupe/approval lands in PEP-2). */
    registerOpportunity: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            product: string;
            customerName: string;
            contactName?: string | undefined;
            customerDomain?: string | undefined;
            amount?: number | undefined;
        };
        output: {
            id: string;
        };
        meta: object;
    }>;
    /** Initiate a renewal from an asset/license; preserves the link (R66/R67). */
    createRenewal: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            assetId: string;
        };
        output: {
            id: string;
            sourceAssetId: string | null;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=sf.d.ts.map