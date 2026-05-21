import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './auth';

/**
 * Console "who are you?" scope — Nick's homepage ask. Two axes the staff
 * user narrows by: Business Unit + Region. The choice is a convenience
 * narrowing persisted to localStorage; the *access* floor is enforced
 * server-side (a BU-restricted user can never widen past their assignment —
 * see partner-forge services/scope.ts).
 *
 * These option lists mirror packages/shared/src/taxonomy.ts. The web has no
 * runtime dependency on @partnerforge/shared (types are vendored), so they're
 * duplicated here as plain constants.
 */
export const BUSINESS_UNITS = ['DX', 'INFRA', 'ADP'] as const;
export const REGIONS = ['NA', 'EMEA', 'APJ', 'CALA'] as const;

/** Products per BU — drives the cascading Product dropdown. Mirrors
 *  packages/shared/src/taxonomy.ts BU_PRODUCTS (web has no runtime dep on
 *  @partnerforge/shared). */
export const PRODUCTS_BY_BU: Record<string, string[]> = {
  DX: ['Sitefinity', 'ShareFile', 'MOVEit'],
  INFRA: ['WhatsUp Gold', 'Flowmon', 'Kemp', 'Chef'],
  ADP: ['OpenEdge', 'Agentic RAG', 'DataDirect', 'MarkLogic'],
};
export const ALL_PRODUCTS: string[] = Object.values(PRODUCTS_BY_BU).flat();

export interface Scope {
  businessUnit: string | null;
  region: string | null;
  product: string | null;
}

interface ScopeCtx extends Scope {
  /** BUs this user may choose between. Empty/unset ⇒ all BUs (unrestricted). */
  allowedBusinessUnits: string[];
  /** Products available for the current BU (cascade); all products if no BU. */
  availableProducts: string[];
  /** True when the user is locked to a subset of BUs (server-enforced). */
  restricted: boolean;
  setBusinessUnit: (bu: string | null) => void;
  setRegion: (region: string | null) => void;
  setProduct: (product: string | null) => void;
}

const Ctx = createContext<ScopeCtx | null>(null);
const SCOPE_KEY = 'pf.console.scope';

export function ScopeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const allowed = user?.businessUnits ?? [];
  const restricted = allowed.length > 0;

  const [scope, setScope] = useState<Scope>(() => {
    const raw = localStorage.getItem(SCOPE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Scope>) : {};
    return {
      businessUnit: parsed.businessUnit ?? null,
      region: parsed.region ?? null,
      product: parsed.product ?? null,
    };
  });

  // A restricted user can't sit on a BU outside their assignment (e.g. a
  // stale localStorage value, or no choice yet). Pin to their first BU.
  useEffect(() => {
    const first = allowed[0];
    if (restricted && first && (!scope.businessUnit || !allowed.includes(scope.businessUnit))) {
      setScope((s) => ({ ...s, businessUnit: first }));
    }
  }, [restricted, allowed, scope.businessUnit]);

  useEffect(() => {
    localStorage.setItem(SCOPE_KEY, JSON.stringify(scope));
  }, [scope]);

  const availableProducts = scope.businessUnit
    ? (PRODUCTS_BY_BU[scope.businessUnit] ?? [])
    : ALL_PRODUCTS;

  const value = useMemo<ScopeCtx>(
    () => ({
      ...scope,
      allowedBusinessUnits: restricted ? allowed : [...BUSINESS_UNITS],
      availableProducts,
      restricted,
      // Changing BU clears a product that no longer belongs to it (cascade).
      setBusinessUnit: (businessUnit) =>
        setScope((s) => {
          const products = businessUnit ? (PRODUCTS_BY_BU[businessUnit] ?? []) : ALL_PRODUCTS;
          const product = s.product && products.includes(s.product) ? s.product : null;
          return { ...s, businessUnit, product };
        }),
      setRegion: (region) => setScope((s) => ({ ...s, region })),
      setProduct: (product) => setScope((s) => ({ ...s, product })),
    }),
    [scope, allowed, restricted, availableProducts],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScope(): ScopeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useScope outside ScopeProvider');
  return c;
}

/** Scope as list-query params (undefined when not set). */
export function scopeParams(scope: Scope): {
  businessUnit?: string;
  region?: string;
  product?: string;
} {
  return {
    businessUnit: scope.businessUnit ?? undefined,
    region: scope.region ?? undefined,
    product: scope.product ?? undefined,
  };
}
