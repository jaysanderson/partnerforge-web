/**
 * MDF — Market Development Funds.
 *
 * One card per campaign, with the per-partner allocation breakdown and
 * roll-up totals (allocated / spent / ROI). Staff use this to see who's
 * burning their fund and who's underutilising.
 */
import type { ReactElement } from 'react';
import { Megaphone, TrendingUp } from 'lucide-react';
import { useApi } from '../../api/hooks';

const money = (v: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

export function Mdf(): ReactElement {
  const mdf = useApi.mdf.list();
  const campaigns = mdf.data ?? [];
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Programs
        </div>
        <h1 className="font-heading text-h1 font-semibold">Market Development Funds</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Co-marketing budget allocated to partners against campaigns.
          Track allocated vs spent vs ROI. Approvals for partner MDF
          requests come through the Submissions queue.
        </p>
      </div>

      <div className="space-y-4">
        {campaigns.length === 0 && (
          <p className="text-small text-text-secondary">No campaigns yet.</p>
        )}
        {campaigns.map((c) => {
          const spendPct =
            c.budget > 0 ? Math.min(100, Math.round((c.totalSpent / c.budget) * 100)) : 0;
          return (
            <div
              key={c.id}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Megaphone size={16} className="text-progress-blue" />
                    <h2 className="font-heading text-h3 font-semibold">{c.name}</h2>
                    <span className="rounded-full bg-surface-alt px-2 py-0.5 text-caption capitalize">
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-caption text-text-secondary">
                    {c.type} · {c.startDate ?? '—'} → {c.endDate ?? '—'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-caption text-text-secondary">Budget</div>
                  <div className="font-mono text-h3 font-semibold">
                    {money(c.budget, c.currency)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Stat label="Allocated" value={money(c.totalAllocated, c.currency)} />
                <Stat label="Spent" value={money(c.totalSpent, c.currency)} />
                <Stat
                  label="ROI"
                  value={money(c.totalRoi, c.currency)}
                  tone="success"
                  icon={TrendingUp}
                />
              </div>

              <div className="mt-3">
                <div className="text-caption text-text-secondary">
                  Spend vs budget: {spendPct}%
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-[var(--radius-control)] bg-surface-alt">
                  <div
                    className="h-full rounded-[var(--radius-control)] bg-progress-blue"
                    style={{ width: `${spendPct}%` }}
                  />
                </div>
              </div>

              {c.allocations.length > 0 && (
                <table className="mt-4 w-full text-small">
                  <thead>
                    <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                      <th className="px-3 py-2">Partner</th>
                      <th className="px-3 py-2 text-right">Allocated</th>
                      <th className="px-3 py-2 text-right">Spent</th>
                      <th className="px-3 py-2 text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.allocations.map((a) => (
                      <tr key={a.id} className="border-t border-border">
                        <td className="px-3 py-2">{a.partnerName}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          {money(a.mdfAllocated, c.currency)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {money(a.mdfSpent, c.currency)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-success">
                          {money(a.roiValue, c.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: 'success';
  icon?: React.ComponentType<{ size?: number | string }>;
}): ReactElement {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface-alt p-3">
      <div className="flex items-center gap-1.5 text-caption text-text-secondary">
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-subhead font-semibold ${
          tone === 'success' ? 'text-success' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}
