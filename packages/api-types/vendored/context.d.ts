import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { type DbConnection } from '@partnerforge/db';
import type { AuthPrincipal } from '@partnerforge/shared';
import type { Env } from './env.js';
import type { Logger } from './logger.js';
export interface Context {
    db: DbConnection;
    env: Env;
    log: Logger;
    principal: AuthPrincipal | null;
    ip: string;
}
export declare function makeContextFactory(env: Env, log: Logger): ({ req }: CreateFastifyContextOptions) => Context;
