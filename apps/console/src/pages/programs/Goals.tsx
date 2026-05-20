/**
 * Goals — per-partner performance targets.
 *
 * One row per goal with metric / period / target / current / progress%.
 * The progressPct bar is the at-a-glance signal — green if on track,
 * amber if slipping, red if behind.
 */
import type { ReactElement } from 'react';
import { Target } from 'lucide-react';
import { useApi } from '../../api/hooks';

function tone(pct: number): string {
  if (pct >= 80) return 'bg-success';
  if (pct >= 50) return 'bg-warning';
  return 'bg-danger';
}

const shortDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString() : '—';

export function Goals(): ReactElement {
  const goals = useApi.goals.list();
  const rows = goals.data ?? [];
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Programs
        </div>
        <h1 className="font-heading text-h1 font-semibold">Goals</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Per-partner performance targets. The intel cron updates progress
          every 4 hours from the deal pipeline. Set a goal to focus a
          partner manager&apos;s next review.
        </p>
      </div>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {rows.length === 0 ? (
          <p className="text-small text-text-secondary">No goals set yet.</p>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Metric</th>
                <th className="px-3 py-2 text-right">Target</th>
                <th className="px-3 py-2 text-right">Current</th>
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">
                    {g.partnerName}
                    <span className="ml-1 text-caption text-text-secondary">{g.tier}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1">
                      <Target size={12} className="text-text-secondary" />
                      {g.metric}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{g.targetValue.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{g.currentValue.toLocaleString()}</td>
                  <td className="px-3 py-2 text-caption text-text-secondary">
                    {shortDate(g.periodStart)} → {shortDate(g.periodEnd)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-alt">
                        <div
                          className={`h-full rounded-full ${tone(g.progressPct)}`}
                          style={{ width: `${g.progressPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-small">{g.progressPct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
