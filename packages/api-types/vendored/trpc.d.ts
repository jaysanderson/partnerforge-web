import { type Action, type InternalRole, type Module } from '@partnerforge/shared';
import type { Context } from './context.js';
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: Context;
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
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/** Requires any authenticated principal (internal or partner). */
export declare const authedProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: import("@partnerforge/shared").AuthPrincipal;
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/** Requires an internal staff principal. */
export declare const internalProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: {
        kind: "internal";
        userId: string;
        email: string;
        role: InternalRole;
    };
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/** Requires a partner-portal principal. */
export declare const partnerProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: {
        kind: "partner";
        contactId: string;
        partnerId: string;
        email: string;
        role: import("@partnerforge/shared").PartnerRole;
    };
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * RBAC gate. Enforced here at the API layer — never trust the client. A role
 * lacking the action on the module is rejected before the resolver runs.
 */
export declare function permission(module: Module, action: Action): import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    role: "admin" | "partner_manager" | "sales_engineer" | "read_only";
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: {
        kind: "internal";
        userId: string;
        email: string;
        role: InternalRole;
    };
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/** Requires a service (API-key) principal. */
export declare const serviceProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: {
        kind: "service";
        keyId: string;
        name: string;
        scopes: string[];
    };
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * Service-only endpoint gated by scopes (e.g. `sync:run`, `partners:read`).
 * `admin:*` grants everything. Orthogonal to internal RBAC.
 */
export declare function scope(...required: string[]): import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: {
        kind: "service";
        keyId: string;
        name: string;
        scopes: string[];
    };
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
/**
 * Endpoint that accepts either an internal user with the RBAC permission OR a
 * service with the named scopes. Used for read paths consumed by both humans
 * (console/portal) and integrators (MCP, jobs, third-parties).
 */
export declare function permissionOrScope(module: Module, action: Action, ...requiredScopes: string[]): import("@trpc/server").TRPCProcedureBuilder<Context, object, {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("@partnerforge/db/schema")> & {
        $client: import("better-sqlite3").Database;
    };
    log: import("pino").Logger<never, boolean>;
    env: import("./env.js").Env;
    principal: import("@partnerforge/shared").AuthPrincipal;
    ip: string;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
