import type { ReactElement } from 'react';
import { Building2, Globe, Lock } from 'lucide-react';
import { REGIONS, useScope } from '../scope';

/**
 * "Who are you?" scope bar — Nick's homepage ask. Two dropdowns (Business
 * Unit + Region) that gate the page below. Sits under the page H1 (the
 * AppShell topbar is already saturated). A BU-restricted user sees only
 * their assigned BUs and a lock hint; an admin gets "All BUs".
 */
export function ScopeBar(): ReactElement {
  const { businessUnit, region, allowedBusinessUnits, restricted, setBusinessUnit, setRegion } =
    useScope();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-subtle/60 px-3 py-2">
      <span className="pf-micro text-ink-3">VIEWING AS</span>

      <label className="flex items-center gap-1.5">
        <Building2 size={14} className="text-ink-3" />
        <select
          aria-label="Business unit"
          value={businessUnit ?? ''}
          onChange={(e) => setBusinessUnit(e.target.value || null)}
          className="rounded-md border border-border bg-surface px-2 py-1 pf-small text-ink-1"
        >
          {!restricted && <option value="">All business units</option>}
          {allowedBusinessUnits.map((bu) => (
            <option key={bu} value={bu}>
              {bu}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5">
        <Globe size={14} className="text-ink-3" />
        <select
          aria-label="Region"
          value={region ?? ''}
          onChange={(e) => setRegion(e.target.value || null)}
          className="rounded-md border border-border bg-surface px-2 py-1 pf-small text-ink-1"
        >
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      {restricted && (
        <span className="flex items-center gap-1 pf-micro text-ink-3" title="Your access is limited to these business units">
          <Lock size={12} /> BU-restricted
        </span>
      )}
    </div>
  );
}
