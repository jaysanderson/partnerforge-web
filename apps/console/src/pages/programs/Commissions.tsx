/**
 * Commissions — Plans / Payouts / Statements / Disputes (each its own route).
 *
 * Four entry points under the Commissions ▾ submenu, all reading from
 * the commissions router added in PR11. Statements aggregate the payouts
 * ledger by partner; disputes are a placeholder note until the schema
 * lands (next milestone).
 */
import { useMemo, type ReactElement } from 'react';
import { Coins, RefreshCw, AlertCircle } from 'lucide-react';
import { useApi, useApiUtils } from '../../api/hooks';

const money = (v: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

function PageHeader({ title, summary }: { title: string; summary: string }): ReactElement {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        Programs → Commissions
      </div>
      <h1 className="font-heading text-h1 font-semibold">{title}</h1>
      <p className="mt-1 max-w-2xl text-body text-text-secondary">{summary}</p>
    </div>
  );
}

export function CommissionPlans(): ReactElement {
  const plans = useApi.commissions.plans();
  const rows = plans.data ?? [];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission plans"
        summary="Tier or product overrides to the default rate. The recompute job uses these when projecting won deals to payouts."
      />
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {rows.length === 0 ? (
          <p className="text-small text-text-secondary">
            No custom plans yet — every partner uses the default tier rate.
          </p>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2">{p.tier ?? '—'}</td>
                  <td className="px-3 py-2">{p.product ?? '—'}</td>
                  <td className="px-3 py-2 capitalize">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export function CommissionPayouts(): ReactElement {
  const utils = useApiUtils();
  const payouts = useApi.commissions.payouts();
  const recompute = useApi.commissions.recompute();
  const onRecompute = () =>
    recompute.mutate(undefined, {
      onSuccess: () => {
        void utils.system.cacheStats.invalidate();
        // Easiest invalidation — queries with these keys are managed by
        // react-query; refetch the ones we care about.
        void payouts.refetch();
      },
    });
  const rows = payouts.data ?? [];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts"
        summary="Per-deal payouts derived from won opportunities at the partner's tier rate. Run recompute to pick up newly-won deals."
      />
      <div className="flex items-center justify-between">
        <span className="text-small text-text-secondary">
          {rows.length} {rows.length === 1 ? 'payout' : 'payouts'} on file
        </span>
        <button
          type="button"
          onClick={onRecompute}
          disabled={recompute.isPending}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-small font-medium text-white disabled:opacity-50"
        >
          <RefreshCw size={14} className={recompute.isPending ? 'animate-spin' : ''} />
          {recompute.isPending ? 'Recomputing…' : 'Recompute from won deals'}
        </button>
      </div>
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {rows.length === 0 ? (
          <p className="text-small text-text-secondary">No payouts yet.</p>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Deal</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Period</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-small">{p.partnerId}</td>
                  <td className="px-3 py-2 font-mono text-small text-text-secondary">{p.dealId}</td>
                  <td className="px-3 py-2 text-right font-mono">{money(p.amount, p.currency)}</td>
                  <td className="px-3 py-2 capitalize">{p.status}</td>
                  <td className="px-3 py-2 text-caption text-text-secondary">{p.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export function CommissionStatements(): ReactElement {
  const statements = useApi.commissions.statements();
  const rows = statements.data ?? [];
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        earned: acc.earned + r.earnedToDate,
        pending: acc.pending + r.pending,
        paid: acc.paid + r.paid,
      }),
      { earned: 0, pending: 0, paid: 0 },
    );
  }, [rows]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Per-partner statements"
        summary="Earned-to-date / pending / paid aggregates per partner, derived from the payouts ledger."
      />
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total earned" value={money(totals.earned)} icon={Coins} />
        <Stat label="Pending" value={money(totals.pending)} icon={Coins} />
        <Stat label="Paid" value={money(totals.paid)} icon={Coins} />
      </div>
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
              <th className="px-3 py-2">Partner</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2 text-right"># payouts</th>
              <th className="px-3 py-2 text-right">Earned</th>
              <th className="px-3 py-2 text-right">Pending</th>
              <th className="px-3 py-2 text-right">Paid</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.partnerId} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{r.partner}</td>
                <td className="px-3 py-2">{r.tier}</td>
                <td className="px-3 py-2 text-right">{r.payoutCount}</td>
                <td className="px-3 py-2 text-right font-mono">{money(r.earnedToDate, r.currency)}</td>
                <td className="px-3 py-2 text-right font-mono">{money(r.pending, r.currency)}</td>
                <td className="px-3 py-2 text-right font-mono">{money(r.paid, r.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function CommissionDisputes(): ReactElement {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Disputes &amp; adjustments"
        summary="Partner-raised disputes plus staff adjustments to payouts. Persistent record for compliance."
      />
      <div className="flex items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-6">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-warning" />
        <div>
          <div className="font-medium">No disputes table yet</div>
          <p className="mt-1 max-w-prose text-small text-text-secondary">
            Dispute tracking lands as its own table (and a partner-portal
            form to raise one) in the next milestone. For now, disputes are
            handled out-of-band — Slack threads or email — and resolved by
            adjusting a payout&apos;s status / amount via the API directly.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number | string }>;
}): ReactElement {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-caption text-text-secondary">
        <Icon size={14} />
        {label}
      </div>
      <div className="mt-1 font-mono text-h3 font-semibold">{value}</div>
    </div>
  );
}
