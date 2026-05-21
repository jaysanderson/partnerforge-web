import { z } from 'zod';
/**
 * Auth surface. Production internal users authenticate via corporate SSO
 * (SAML/OIDC) — that integration lands in a later phase; `devLogin` is the
 * development stand-in and is disabled outside development. Partners use
 * passwordless magic links.
 */
export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    /**
     * Current principal, plus the internal user's BU scope so the Console can
     * pre-lock its scope picker. `businessUnits` is null/empty for unrestricted
     * users (admins or anyone without an assignment). Read live from the DB.
     */
    me: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            businessUnits: string[] | null;
            kind: "internal";
            userId: string;
            email: string;
            role: import("@partnerforge/shared").InternalRole;
        } | {
            businessUnits: string[] | null;
            kind: "partner";
            contactId: string;
            partnerId: string;
            email: string;
            role: import("@partnerforge/shared").PartnerRole;
        } | {
            businessUnits: string[] | null;
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
                businessUnits: string[] | null;
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
//# sourceMappingURL=auth.d.ts.map