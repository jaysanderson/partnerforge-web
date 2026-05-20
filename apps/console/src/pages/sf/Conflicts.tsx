/**
 * Salesforce → Conflict queue.
 *
 * Deals flagged as potential channel conflicts (same customer, multiple
 * partners). Intel runs flag these every 4 hours via ARAG semantic
 * matching + exact-name fuzzy logic. Staff review and resolve.
 */
import type { ReactElement } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { useApi } from '../../api/hooks';

function shortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export function SfConflicts(): ReactElement {
  const conflicts = useApi.deals.conflicts();
  const deals = useApi.deals.list();

  const dealById = (id: string) =>
    deals.data?.find((d) => d.id === id) ?? null;

  const rows = conflicts.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure → Salesforce
        </div>
        <h1 className="font-heading text-h1 font-semibold">Conflict queue</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Deals flagged as potential channel conflicts — same customer name
          across multiple partners, or semantic matches surfaced by ARAG.
          Flagged automatically every 4 hours by the intel cron.
        </p>
      </div>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {rows.length === 0 ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-card)] bg-success/10 p-4">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-success" />
            <div>
              <div className="font-medium text-success">No active conflicts</div>
              <p className="mt-0.5 text-small text-text-secondary">
                Nothing in the queue — every registered deal is on its own
                customer.
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Flagged deal</th>
                <th className="px-3 py-2">Conflicts with</th>
                <th className="px-3 py-2 text-right">Confidence</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Flagged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const a = dealById(c.dealId);
                const b = dealById(c.conflictingDealId);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-warning" />
                        {a?.companyName ?? c.dealId}
                      </div>
                      <div className="text-caption text-text-secondary">
                        {a ? `partner ${a.partnerId}` : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {b?.companyName ?? c.conflictingDealId}
                      <div className="text-caption text-text-secondary">
                        {b ? `partner ${b.partnerId}` : ''}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {Math.round(c.confidenceScore * 100)}%
                    </td>
                    <td className="px-3 py-2 capitalize">{c.status}</td>
                    <td className="px-3 py-2 text-caption text-text-secondary">
                      {shortDate(c.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
