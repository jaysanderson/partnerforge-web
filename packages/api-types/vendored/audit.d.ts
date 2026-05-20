import type { Context } from './context.js';
interface AuditInput {
    action: 'create' | 'update' | 'delete';
    entityType: string;
    entityId: string;
    before?: unknown;
    after?: unknown;
}
/**
 * Every write operation writes to the audit log. No exceptions. Called inside
 * the same logical operation as the mutation.
 */
export declare function writeAudit(ctx: Context, input: AuditInput): void;
export {};
//# sourceMappingURL=audit.d.ts.map