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
export const BUSINESS_UNITS = ['DX', 'Data Platform', 'Chef', 'AI'] as const;
export const REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM', 'ANZ'] as const;

export interface Scope {
  businessUnit: string | null;
  region: string | null;
}

interface ScopeCtx extends Scope {
  /** BUs this user may choose between. Empty/unset ⇒ all BUs (unrestricted). */
  allowedBusinessUnits: string[];
  /** True when the user is locked to a subset of BUs (server-enforced). */
  restricted: boolean;
  setBusinessUnit: (bu: string | null) => void;
  setRegion: (region: string | null) => void;
}

const Ctx = createContext<ScopeCtx | null>(null);
const SCOPE_KEY = 'pf.console.scope';

export function ScopeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const allowed = user?.businessUnits ?? [];
  const restricted = allowed.length > 0;

  const [scope, setScope] = useState<Scope>(() => {
    const raw = localStorage.getItem(SCOPE_KEY);
    return raw ? (JSON.parse(raw) as Scope) : { businessUnit: null, region: null };
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

  const value = useMemo<ScopeCtx>(
    () => ({
      ...scope,
      allowedBusinessUnits: restricted ? allowed : [...BUSINESS_UNITS],
      restricted,
      setBusinessUnit: (businessUnit) => setScope((s) => ({ ...s, businessUnit })),
      setRegion: (region) => setScope((s) => ({ ...s, region })),
    }),
    [scope, allowed, restricted],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScope(): ScopeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useScope outside ScopeProvider');
  return c;
}

/** Scope as list-query params (undefined when not set). */
export function scopeParams(scope: Scope): { businessUnit?: string; region?: string } {
  return {
    businessUnit: scope.businessUnit ?? undefined,
    region: scope.region ?? undefined,
  };
}
