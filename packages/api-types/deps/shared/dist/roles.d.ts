/**
 * RBAC. Roles and a per-module permission matrix. Enforced at the API
 * middleware layer — never trust the client.
 */
export declare const INTERNAL_ROLES: readonly ["admin", "partner_manager", "sales_engineer", "read_only"];
export type InternalRole = (typeof INTERNAL_ROLES)[number];
/** Partner-portal principals are a distinct kind, never an internal role. */
export declare const PARTNER_ROLE: "partner";
export type PartnerRole = typeof PARTNER_ROLE;
export type Role = InternalRole | PartnerRole;
export declare const MODULES: readonly ["partners", "deals", "content", "commissions", "campaigns", "reports", "users", "audit", "config", "apiKeys"];
export type Module = (typeof MODULES)[number];
export type Action = 'read' | 'create' | 'update' | 'delete';
type ModulePermissions = Record<Module, ReadonlyArray<Action>>;
export declare const PERMISSIONS: Record<InternalRole, ModulePermissions>;
export declare function isInternalRole(role: string): role is InternalRole;
/** Does an internal role permit `action` on `module`? */
export declare function can(role: InternalRole, module: Module, action: Action): boolean;
export {};
//# sourceMappingURL=roles.d.ts.map