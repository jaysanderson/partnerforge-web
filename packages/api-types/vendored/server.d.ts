import { type ZodTypeProvider } from 'fastify-type-provider-zod';
import type { Env } from './env.js';
import type { Logger } from './logger.js';
export declare function buildServer(env: Env, log: Logger): Promise<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("pino").Logger<never, boolean>, ZodTypeProvider>>;
