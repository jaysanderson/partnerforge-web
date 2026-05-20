/**
 * REST + OpenAPI surface — the public API that customers integrate against
 * from any language (Python, Java, Power Automate, Make/Zapier, etc.).
 *
 * The console + portal keep using tRPC (faster, type-safe, browser-native).
 * REST routes are thin aliases that delegate to `appRouter.createCaller(ctx)`
 * so we never duplicate validation, RBAC, or business logic — the OpenAPI
 * doc and the tRPC client speak to the same handlers underneath.
 *
 * Auth: `X-Api-Key` header (minted via `POST /v1/api-keys` admin endpoint or
 * the apiKeys tRPC router). The same key scopes (`partners:read`,
 * `deals:write`, `admin:*`, …) apply.
 *
 * Swagger UI is served at `/docs`; the OpenAPI 3.1 JSON at `/docs/json`.
 */
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { Env } from './env.js';
import type { Logger } from './logger.js';
/** Fastify instance with the Zod type-provider wired in. */
type AppFastify = FastifyInstance<any, any, any, any, ZodTypeProvider>;
/** Register the REST aliases onto a Fastify instance. */
export declare function registerRestRoutes(app: AppFastify, env: Env, log: Logger): void;
export {};
//# sourceMappingURL=rest.d.ts.map