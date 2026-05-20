/** Structured JSON logging. Pretty in dev, JSON in production. */
export declare function createLogger(level: string, dev: boolean): import("pino").Logger<never, boolean>;
export type Logger = ReturnType<typeof createLogger>;
//# sourceMappingURL=logger.d.ts.map