/**
 * Tiers — per-tier rollups derived from partners.tier.
 *
 * Tier *definitions* (entry rules, benefits) land in a future schema
 * bump; this page surfaces what the platform already knows: counts,
 * engagement, open pipeline.
 */
import type { ReactElement } from 'react';
import { Award } from 'lucide-react';
import { useApi } from '../../api/hooks';

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

const TIER_COLOR: Record<string, string> = {
  Registered: 'text-text-secondary bg-surface-alt',
  Silver: 'text-text-primary bg-surface-alt',
  Gold: 'text-warning bg-warning/10',
  Platinum: 'text-progress-blue bg-ai-surface',
  Strategic: 'text-success bg-success/10',
};

export function Tiers(): ReactElement {
  const tiers = useApi.tiers.list();
  const rows = tiers.data ?? [];
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure
        </div>
        <h1 className="font-heading text-h1 font-semibold">Tiers</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Each labelset tier value with the current count of partners, average
          engagement, and open pipeline. Entry rules and benefits per tier
          land as their own editor once we add the tier_defs table.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div
            key={r.tier}
            className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${TIER_COLOR[r.tier] ?? 'bg-surface-alt'}`}>
                <Award size={12} />
                {r.tier}
              </span>
              <span className="font-mono text-h2 font-semibold">{r.partnerCount}</span>
            </div>
            <dl className="space-y-1 text-small">
              <Row k="Partners" v={String(r.partnerCount)} />
              <Row k="Avg engagement" v={`${r.avgEngagement}/100`} />
              <Row k="Open pipeline" v={money(r.openPipeline)} />
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }): ReactElement {
  return (
    <div className="flex justify-between">
      <dt className="text-text-secondary">{k}</dt>
      <dd className="font-mono">{v}</dd>
    </div>
  );
}
