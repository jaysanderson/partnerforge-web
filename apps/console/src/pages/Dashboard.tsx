import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { MetricCard } from '@partnerforge/ui';
import { useApi } from '../api/hooks';
import { money } from '../lib/format';

const STAGE_COLOUR: Record<string, string> = {
  Registered: '#94A3B8',
  Qualified: '#0D6EFD',
  Proposal: '#D97706',
  Negotiation: '#5CE500',
  'Closed Won': '#16A34A',
  'Closed Lost': '#DC2626',
};

export function Dashboard() {
  const partners = useApi.partners.list();
  const deals = useApi.deals.list();
  const pipeline = useApi.ai.pipelineSummary();
  const insight = useApi.ai.ask();

  const stats = useMemo(() => {
    const ps = partners.data ?? [];
    const ds = deals.data ?? [];
    const open = ds.filter((d) => d.status === 'open');
    const won = ds.filter((d) => d.status === 'won');
    const avgEng = ps.length
      ? Math.round(ps.reduce((s, p) => s + p.engagementScore, 0) / ps.length)
      : 0;
    return {
      openValue: open.reduce((s, d) => s + d.value, 0),
      wonValue: won.reduce((s, d) => s + d.value, 0),
      activePartners: ps.filter((p) => p.status === 'active').length,
      avgEng,
    };
  }, [partners.data, deals.data]);

  const maxStage = Math.max(1, ...(pipeline.data?.stages.map((s) => s.value) ?? [1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page font-semibold">Dashboard</h1>
        <p className="text-small text-text-secondary">Progress Partner Network — operational overview</p>
      </div>

      {/* KPI tiles. No delta chips: PartnerForge doesn't track period-over-
          period yet (timeframe + sparklines land in PR_UX6). Rendering a
          fake `+8.4 %` chip on a real $-value was an immediate trust
          regression for the UX audit; leave the headline figure honest. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Partner-Sourced Pipeline" value={money(stats.openValue)} />
        <MetricCard label="Closed Revenue (Won)" value={money(stats.wonValue)} />
        <MetricCard label="Active Partners" value={String(stats.activePartners)} />
        <MetricCard label="Avg Engagement" value={`${stats.avgEng}/100`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-subhead font-semibold">Deal Activity</h2>
          <ul className="space-y-2.5">
            {(deals.data ?? []).slice(0, 8).map((d) => (
              <li key={d.id} className="flex items-center justify-between text-small">
                <span className="text-text-primary">
                  {d.companyName} <span className="text-text-secondary">· {d.stage}</span>
                </span>
                <span className="font-mono text-text-secondary">{money(d.value, d.currency)}</span>
              </li>
            ))}
            {deals.data?.length === 0 && (
              <li className="text-small text-text-secondary">No deals yet.</li>
            )}
          </ul>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-ai-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-ai-accent" />
            <h2 className="text-subhead font-semibold">AI Insights</h2>
          </div>
          {insight.data?.answer ? (
            <p className="whitespace-pre-wrap text-small text-text-primary">{insight.data.answer}</p>
          ) : (
            <button
              type="button"
              onClick={() =>
                insight.mutate({
                  query:
                    'Across all partners and deals, what are the top 3 actions partner managers should take this week? Be concise.',
                  scope: 'deal',
                  context: [],
                })
              }
              disabled={insight.isPending}
              className="rounded-[var(--radius-control)] border border-ai-accent px-3 py-1.5 text-small font-medium text-ai-accent disabled:opacity-50"
            >
              {insight.isPending ? 'Analysing…' : 'Generate insights'}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 text-subhead font-semibold">Pipeline by Stage</h2>
        <div className="space-y-2">
          {(pipeline.data?.stages ?? []).map((s) => (
            <div key={s.stage} className="flex items-center gap-3">
              <span className="w-28 text-small text-text-secondary">{s.stage}</span>
              <div className="h-5 flex-1 rounded-[var(--radius-control)] bg-surface-alt">
                <div
                  className="h-full rounded-[var(--radius-control)]"
                  style={{
                    width: `${(s.value / maxStage) * 100}%`,
                    background: STAGE_COLOUR[s.stage] ?? '#0D6EFD',
                  }}
                />
              </div>
              <span className="w-24 text-right font-mono text-small">{money(s.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
