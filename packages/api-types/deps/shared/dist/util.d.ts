/** Prefixed, sortable-enough id. e.g. `dl_a1b2c3...`. */
export declare function id(prefix: string): string;
/** ISO 8601 timestamp. SQLite stores timestamps as TEXT. */
export declare function nowIso(): string;
export declare function addHours(date: Date, hours: number): Date;
export declare function isExpired(isoTimestamp: string | null | undefined): boolean;
/** Sleep helper for retry/backoff. */
export declare function sleep(ms: number): Promise<void>;
