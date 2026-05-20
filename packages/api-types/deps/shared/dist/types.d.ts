import type { InternalRole, PartnerRole } from './roles.js';
/** A consistent, serialisable API error shape. */
export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
}
/**
 * Runtime mode. `demo` = mock connectors (Salesforce/SharePoint). `live` =
 * real connectors, which fail loudly if not configured (no mock fallback).
 */
export type AppMode = 'demo' | 'live';
export type PartnerStatus = 'active' | 'inactive' | 'onboarding' | 'churned';
export type DealStatus = 'open' | 'won' | 'lost';
export type ContentStatus = 'draft' | 'published';
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ConflictStatus = 'flagged' | 'accepted' | 'rejected' | 'merged';
export type CertificationStatus = 'in_progress' | 'completed' | 'expired';
export type PayoutStatus = 'pending' | 'paid';
export type NotificationChannel = 'email' | 'in_app';
export type SyncDirection = 'inbound' | 'outbound';
export type SyncStatus = 'pending' | 'success' | 'failed';
/**
 * Authenticated principal. `kind` discriminates internal staff (JWT), partner
 * contacts (JWT), and service consumers (API key in DB — MCP, jobs, external
 * integrators). Services carry their scopes directly; humans carry roles.
 */
export type AuthPrincipal = {
    kind: 'internal';
    userId: string;
    email: string;
    role: InternalRole;
} | {
    kind: 'partner';
    contactId: string;
    partnerId: string;
    email: string;
    role: PartnerRole;
} | {
    kind: 'service';
    keyId: string;
    name: string;
    scopes: string[];
};
export interface LabelAssignment {
    set: string;
    value: string;
}
//# sourceMappingURL=types.d.ts.map