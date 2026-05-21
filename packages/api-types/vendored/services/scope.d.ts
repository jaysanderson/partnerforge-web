import type { BusinessUnit } from '@partnerforge/shared';
import type { Context } from '../context.js';
/** 'all' means unrestricted; otherwise the explicit list of allowed BUs. */
export type AllowedBUs = 'all' | BusinessUnit[];
export declare function allowedBusinessUnits(ctx: Context): AllowedBUs;
/** Filter rows by their own BU value. Unrestricted callers pass through. */
export declare function scopeByBU<T>(ctx: Context, rows: T[], getBU: (row: T) => string | null | undefined): T[];
/**
 * The set of partner IDs the caller may see under BU scope, or 'all'.
 * Resolved by reading the partners table once. Used to scope rows that
 * reference a partner (deals, goals, …) without a BU column of their own —
 * a row is visible iff its partner is.
 */
export declare function visiblePartnerIds(ctx: Context): 'all' | Set<string>;
/** Filter partner-referencing rows to the caller's visible partners. */
export declare function scopeByPartner<T>(ctx: Context, rows: T[], getPartnerId: (row: T) => string | null | undefined): T[];
//# sourceMappingURL=scope.d.ts.map