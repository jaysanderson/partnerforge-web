export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    auth: import("@trpc/server").TRPCBuiltRouter<{
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
        me: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                kind: "internal";
                userId: string;
                email: string;
                role: import("@partnerforge/shared").InternalRole;
            } | {
                kind: "partner";
                contactId: string;
                partnerId: string;
                email: string;
                role: import("@partnerforge/shared").PartnerRole;
            } | {
                kind: "service";
                keyId: string;
                name: string;
                scopes: string[];
            };
            meta: object;
        }>;
        devLogin: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
            };
            output: {
                token: string;
                user: {
                    id: string;
                    name: string;
                    email: string;
                    role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
                };
            };
            meta: object;
        }>;
        magicLinkRequest: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
            };
            output: {
                sent: boolean;
                devMagicToken?: undefined;
            } | {
                sent: boolean;
                devMagicToken: string;
            };
            meta: object;
        }>;
        magicLinkVerify: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                magicToken: string;
            };
            output: {
                token: string;
                contact: {
                    id: string;
                    name: string;
                    partnerId: string;
                };
            };
            meta: object;
        }>;
    }>>;
    partners: import("@trpc/server").TRPCBuiltRouter<{
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
    partnerContacts: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                partnerId: string;
            };
            output: {
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
            meta: object;
        }>;
    }>>;
    deals: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                partnerId?: string | undefined;
                stage?: string | undefined;
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
    content: import("@trpc/server").TRPCBuiltRouter<{
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
    users: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                email: string;
                role: string;
                id: string;
                name: string;
                createdAt: string;
                updatedAt: string;
                lastLogin: string | null;
                avatarUrl: string | null;
            }[];
            meta: object;
        }>;
        get: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                email: string;
                role: string;
                id: string;
                name: string;
                createdAt: string;
                updatedAt: string;
                lastLogin: string | null;
                avatarUrl: string | null;
            };
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
                name: string;
            };
            output: {
                createdAt: string;
                updatedAt: string;
                email: string;
                role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
                name: string;
                id: string;
            };
            meta: object;
        }>;
        update: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                role?: "admin" | "partner_manager" | "sales_engineer" | "read_only" | undefined;
                name?: string | undefined;
            };
            output: {
                email: string;
                role: string;
                id: string;
                name: string;
                createdAt: string;
                updatedAt: string;
                lastLogin: string | null;
                avatarUrl: string | null;
            } | undefined;
            meta: object;
        }>;
    }>>;
    audit: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                userId?: string | undefined;
                limit?: number | undefined;
                entityType?: string | undefined;
                entityId?: string | undefined;
            } | undefined;
            output: {
                userId: string | null;
                id: string;
                createdAt: string;
                userRole: string | null;
                action: string;
                entityType: string;
                entityId: string;
                beforeState: unknown;
                afterState: unknown;
                ipAddress: string | null;
            }[];
            meta: object;
        }>;
    }>>;
    ai: import("@trpc/server").TRPCBuiltRouter<{
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
        search: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                query: string;
                limit?: number | undefined;
                scope?: "partner" | "deal" | "enablement" | undefined;
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
        ask: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                query: string;
                scope?: "partner" | "deal" | "enablement" | undefined;
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
        generateQbr: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                partnerId: string;
            };
            output: {
                partner: string;
                qbr: string;
                citations: import("@partnerforge/arag-client").AragCitation[];
            };
            meta: object;
        }>;
        insightsForPartner: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                partnerId: string;
            };
            output: {
                id: string;
                expiresAt: string | null;
                contextType: string;
                contextId: string;
                insightText: string;
                actions: unknown[];
                relevanceScore: number;
                generatedAt: string;
                dismissedBy: string[];
            }[];
            meta: object;
        }>;
        pipelineSummary: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                totalValue: number;
                stages: {
                    count: number;
                    value: number;
                    stage: string;
                }[];
            };
            meta: object;
        }>;
    }>>;
    portal: import("@trpc/server").TRPCBuiltRouter<{
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
                mediaType: "link" | "video" | "document";
                durationSeconds: number | null;
                thumbnailUrl: string | null;
                fileUrl: string | null;
                transcriptStatus: "pending" | "processing" | "ready" | "failed" | null;
            }[];
            meta: object;
        }>;
        videoGet: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                row: {
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
                aragResource: Record<string, unknown> | null;
            };
            meta: object;
        }>;
        videoTranscript: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
            };
            output: {
                paragraphs: import("./portal.js").TranscriptParagraph[];
            };
            meta: object;
        }>;
        videoUpNext: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                id: string;
                limit?: number | undefined;
            };
            output: {
                hits: {
                    localId: string | null;
                    title: string;
                    description: string | undefined;
                    thumbnailUrl: string | null;
                    durationSeconds: number | null;
                    score: number;
                }[];
            };
            meta: object;
        }>;
        videoAsk: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
                query: string;
                context?: {
                    text: string;
                    author: "USER" | "ARAG";
                }[] | undefined;
            };
            output: {
                ok: false;
                answer: string;
                citations: never[];
                error?: undefined;
            } | {
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
    reports: import("@trpc/server").TRPCBuiltRouter<{
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
        pipeline: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                byStage: Record<string, {
                    count: number;
                    value: number;
                }>;
                byProduct: Record<string, {
                    count: number;
                    value: number;
                }>;
                byRegion: Record<string, {
                    count: number;
                    value: number;
                }>;
                total: number;
            };
            meta: object;
        }>;
        revenueAttribution: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                partnerSourced: number;
                openPipeline: number;
                wonCount: number;
            };
            meta: object;
        }>;
        partnerScorecard: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                partner: string;
                tier: string;
                engagement: number;
                churnRisk: number;
                openPipeline: number;
                closedRevenue: number;
            }[];
            meta: object;
        }>;
        contentEffectiveness: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                title: string;
                type: string;
                status: import("@partnerforge/shared").ContentStatus;
                views: number;
            }[];
            meta: object;
        }>;
        programHealth: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                totalPartners: number;
                byTier: Record<string, number>;
                avgEngagement: number;
                certificationsCompleted: number;
            };
            meta: object;
        }>;
    }>>;
    commissions: import("@trpc/server").TRPCBuiltRouter<{
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
        plans: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                status: string;
                id: string;
                name: string;
                createdAt: string;
                product: string | null;
                updatedAt: string;
                tier: string | null;
                rules: unknown[];
            }[];
            meta: object;
        }>;
        payouts: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                status: import("@partnerforge/shared").PayoutStatus;
                partnerId: string;
                id: string;
                createdAt: string;
                currency: string;
                updatedAt: string;
                dealId: string | null;
                amount: number;
                planId: string | null;
                period: string;
            }[];
            meta: object;
        }>;
        statements: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                partnerId: string;
                partner: string;
                tier: string;
                earnedToDate: number;
                pending: number;
                paid: number;
                currency: string;
                payoutCount: number;
            }[];
            meta: object;
        }>;
        recompute: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                created: number;
            };
            meta: object;
        }>;
    }>>;
    sf: import("@trpc/server").TRPCBuiltRouter<{
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
        account: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@partnerforge/salesforce").SfAccount;
            meta: object;
        }>;
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
    submissions: import("@trpc/server").TRPCBuiltRouter<{
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
                findings: {
                    kind: string;
                    detail: string;
                    matchId?: string;
                    confidence?: number;
                }[];
                recommendation: "create" | "update" | "reject";
                sfRecordId: string | null;
            };
            meta: object;
        }>;
    }>>;
    approvals: import("@trpc/server").TRPCBuiltRouter<{
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
    assist: import("@trpc/server").TRPCBuiltRouter<{
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
    collaboration: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                recordType: string;
                recordId: string;
            };
            output: {
                id: string;
                createdAt: string;
                accountId: string;
                recordType: string;
                recordId: string;
                body: string;
                authorType: string;
                authorId: string;
                authorName: string;
                mentions: string[];
                syncedToSf: boolean;
            }[];
            meta: object;
        }>;
        add: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                recordType: string;
                recordId: string;
                body: string;
            };
            output: {
                id: string;
                mentions: string[];
                syncedToSf: boolean;
            };
            meta: object;
        }>;
    }>>;
    adminConfig: import("@trpc/server").TRPCBuiltRouter<{
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
        sharepointAssets: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("@partnerforge/sharepoint").SharePointAsset[];
            meta: object;
        }>;
        mode: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                mode: import("@partnerforge/shared").AppMode;
            };
            meta: object;
        }>;
        setMode: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                mode: "demo" | "live";
            };
            output: {
                mode: "demo" | "live";
            };
            meta: object;
        }>;
        salesforceConfig: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                mode: import("@partnerforge/shared").AppMode;
                useMockInLive: boolean;
                envPresent: {
                    baseUrl: boolean;
                    username: boolean;
                    password: boolean;
                };
                connector: "mock" | "live-stub" | "live-real";
            };
            meta: object;
        }>;
        setUseMockInLive: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                value: boolean;
            };
            output: {
                useMockInLive: boolean;
            };
            meta: object;
        }>;
        testSalesforceConnection: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                ok: true;
                kind: "mock";
                latencyMs: number;
                errorMessage?: undefined;
            } | {
                ok: false;
                kind: "live-stub";
                errorMessage: string;
                latencyMs?: undefined;
            } | {
                ok: true;
                kind: "live-real";
                latencyMs: number;
                errorMessage?: undefined;
            } | {
                ok: false;
                kind: "live-real";
                latencyMs: number;
                errorMessage: string;
            };
            meta: object;
        }>;
        oppFieldOverrides: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("./adminConfig.js").OppFieldOverride[];
            meta: object;
        }>;
        setOppFieldOverrides: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                apiName: string;
                partnerLabel?: string | undefined;
                visibleToPartner?: boolean | undefined;
            }[];
            output: {
                ok: boolean;
                count: number;
            };
            meta: object;
        }>;
        setSharepointAssets: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                region: string;
                title: string;
                productFamily: string;
                url: string;
            }[];
            output: {
                ok: boolean;
                count: number;
            };
            meta: object;
        }>;
    }>>;
    i18n: import("@trpc/server").TRPCBuiltRouter<{
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
        locales: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                code: string;
                label: string;
            }[];
            meta: object;
        }>;
        translate: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                locale: string;
                texts: string[];
            };
            output: Record<string, string>;
            meta: object;
        }>;
    }>>;
    apiKeys: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                id: string;
                name: string;
                prefix: string;
                scopes: string[];
                createdBy: string;
                createdAt: string;
                lastUsedAt: string | null;
                revokedAt: string | null;
            }[];
            meta: object;
        }>;
        create: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                name: string;
                scopes?: string[] | undefined;
            };
            output: {
                id: string;
                name: string;
                prefix: string;
                scopes: string[];
                plaintext: string;
            };
            meta: object;
        }>;
        revoke: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                id: string;
            };
            output: {
                id: string;
                revokedAt: string;
            };
            meta: object;
        }>;
    }>>;
    system: import("@trpc/server").TRPCBuiltRouter<{
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
        syncRunAll: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../services/sync.js").SyncSummary;
            meta: object;
        }>;
        intelRefreshEngagement: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                partners: number;
            };
            meta: object;
        }>;
        intelGenerateInsights: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                partners: number;
            };
            meta: object;
        }>;
        intelScanConflicts: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                flagged: number;
            };
            meta: object;
        }>;
        aragSetupLabelsets: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: import("../services/aragSetup.js").AragSetupReport;
            meta: object;
        }>;
        aragSetupVideoKb: import("@trpc/server").TRPCMutationProcedure<{
            input: void;
            output: {
                uuid: string;
                title: string;
                labelsets: number;
                daTasks: number;
            };
            meta: object;
        }>;
        cacheStats: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                partners: {
                    total: number;
                    synced: number;
                    oldestSync: string | null;
                };
                deals: {
                    total: number;
                    synced: number;
                    oldestSync: string | null;
                };
                partnerContacts: {
                    total: number;
                    synced: number;
                    oldestSync: string | null;
                };
            };
            meta: object;
        }>;
        cacheRefresh: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                entity?: "partner" | "all" | "contact" | "opportunity" | undefined;
            };
            output: {
                entity: "partner" | "all" | "contact" | "opportunity";
                cleared: Record<string, number>;
            };
            meta: object;
        }>;
    }>>;
    tasks: import("@trpc/server").TRPCBuiltRouter<{
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
    mdf: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                allocations: {
                    partnerName: string;
                    partnerId: string;
                    id: string;
                    campaignId: string;
                    mdfAllocated: number;
                    mdfSpent: number;
                    roiValue: number;
                }[];
                totalAllocated: number;
                totalSpent: number;
                totalRoi: number;
                status: string;
                type: string;
                id: string;
                name: string;
                createdAt: string;
                currency: string;
                updatedAt: string;
                budget: number;
                startDate: string | null;
                endDate: string | null;
            }[];
            meta: object;
        }>;
    }>>;
    goals: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                partnerName: string;
                tier: string | null;
                progressPct: number;
                partnerId: string;
                id: string;
                createdAt: string;
                updatedAt: string;
                metric: string;
                targetValue: number;
                currentValue: number;
                periodStart: string;
                periodEnd: string;
            }[];
            meta: object;
        }>;
    }>>;
    training: import("@trpc/server").TRPCBuiltRouter<{
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
    tiers: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                tier: "Registered" | "Silver" | "Gold" | "Platinum" | "Strategic";
                partnerCount: number;
                avgEngagement: number;
                openPipeline: number;
            }[];
            meta: object;
        }>;
    }>>;
    journeys: import("@trpc/server").TRPCBuiltRouter<{
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
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                stage: "onboarding" | "active" | "at_risk" | "churned";
                count: number;
                partners: {
                    id: string;
                    name: string;
                    tier: string;
                    engagementScore: number;
                    churnRiskScore: number;
                }[];
            }[];
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map