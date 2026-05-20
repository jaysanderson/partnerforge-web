/**
 * Partner contacts. The Salesforce `Contact` object is the source of truth;
 * the local `partner_contacts` table is a read-through cache (PR_SF1).
 *
 * In `live` mode `list({ partnerId })` refreshes that partner's contacts
 * from SF on stale. In `demo` mode the seed wins (matches today's behaviour
 * exactly — there was no contacts router before this, but `auth.ts` and
 * `portal.ts` query the table directly).
 */
import { z } from 'zod';
export declare const partnerContactsRouter: import("@trpc/server").TRPCBuiltRouter<{
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
//# sourceMappingURL=partnerContacts.d.ts.map