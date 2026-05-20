import type { Context } from './context.js';
/**
 * Deal conflict detection. ARAG semantic search over the Deal KB is the
 * signal; the DB resolves the concrete conflicting deal. Best-effort — never
 * blocks deal creation if ARAG is unavailable.
 */
export declare function detectConflictsForDeal(ctx: Context, dealId: string): Promise<number>;
//# sourceMappingURL=conflicts.d.ts.map