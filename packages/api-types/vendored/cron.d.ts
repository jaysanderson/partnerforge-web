import type { DbConnection } from '@partnerforge/db';
import type { Env } from './env.js';
import type { Logger } from './logger.js';
export declare function startCron(db: DbConnection, env: Env, log: Logger): () => void;
