import { type AuthPrincipal, type InternalRole } from '@partnerforge/shared';
import { type DbConnection } from '@partnerforge/db';
import type { Env } from './env.js';
export declare function signInternalToken(env: Env, user: {
    id: string;
    email: string;
    role: InternalRole;
}): string;
export declare function signPartnerToken(env: Env, contact: {
    id: string;
    partnerId: string;
    email: string;
}): string;
/** Verify a bearer token and normalise to an AuthPrincipal, or null. */
export declare function verifyToken(env: Env, token: string): AuthPrincipal | null;
export declare function principalFromHeader(env: Env, header?: string): AuthPrincipal | null;
/** Short-lived single-purpose token emailed to partners (no passwords). */
export declare function signMagicToken(env: Env, contactId: string): string;
export declare function verifyMagicToken(env: Env, token: string): string | null;
/** Stable string id for any principal — used by audit / author fields. */
export declare function actorId(p: AuthPrincipal): string;
export declare function actorType(p: AuthPrincipal): 'internal' | 'partner' | 'service';
/** Plaintext format: `pfk_<32 hex chars>`. Easy to recognise in logs. */
export declare function newApiKeyPlaintext(): string;
export declare function hashApiKey(plaintext: string): string;
export declare function apiKeyPrefix(plaintext: string): string;
/**
 * Resolve an X-Api-Key header value to a service principal, or null. Updates
 * `last_used_at` opportunistically (debounced, best-effort).
 */
export declare function principalFromApiKey(db: DbConnection, headerValue: string | undefined): AuthPrincipal | null;
//# sourceMappingURL=auth.d.ts.map