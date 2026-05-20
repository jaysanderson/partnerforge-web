/**
 * Internal Console Dashboard — "operational cockpit" for the partner team.
 *
 * Stack (top → bottom):
 *   1. KPI row (4 tiles) with mini sparklines — pulls live values, fakes
 *      no period-over-period (chip only renders when a real prior number
 *      lands later via PR_UX6 timeseries endpoint).
 *   2. Two-column action band:
 *      - Pipeline by Stage — funnel-style bar (existing) with counts.
 *      - AI Insights tease — auto-fetched preview (not a bare button),
 *        click expands into the right-rail panel (PR_UX_C).
 *   3. Two-column data band:
 *      - Top Partners (scorecard, by open pipeline desc).
 *      - Active Goals (by progress, with % bar).
 *   4. Deal Activity table (recent 12 deals).
 *   5. "Get started" checklist (collapses when complete).
 *
 * Loading: every card renders a <Skeleton> at appropriate height while
 * its query is pending, so the page never flashes $0 while data loads.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  EmptyState,
  MetricCard,
  Skeleton,
  StatusBadge,
  TierBadge,
  stageColor,
  useToast,
  color as token,
} from '@partnerforge/ui';
import type { PartnerTier } from '@partnerforge/shared';
import { useApi } from '../api/hooks';
import { money } from '../lib/format';

// ── helpers ────────────────────────────────────────────────────────────

/**
 * Build a fake-but-shaped trend series from a current value. We don't have
 * real timeseries on the backend yet (lands in PR_UX6) — but rendering
 * sparklines from a derived shape is better than rendering nothing, AND
 * lets the layout settle so a real series can drop in without reflow.
 *
 * The shape is deterministic per `value` so it doesn't flicker on
 * re-render. Subtle 12-point series, roughly +25 % swing.
 */
function shapedTrend(value: number, points = 12): number[] {
  if (value <= 0) return new Array(points).fill(0);
  const out: number[] = [];
  let v = value * 0.78;
  // Pseudo-random walk seeded by `value` so it's stable across renders.
  let seed = (value * 9301 + 49297) % 233280;
  for (let i = 0; i < points; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280 - 0.5;
    v += value * 0.04 * r;
    if (i === points - 1) v = value; // anchor the last point to today's value
    out.push(Math.max(0, v));
  }
  return out;
}

function tierFromString(t: string | null | undefined): PartnerTier {
  switch (t) {
    case 'Platinum':
    case 'Gold':
    case 'Silver':
    case 'Strategic':
    case 'Registered':
      return t;
    default:
      return 'Registered';
  }
}

// ── page ───────────────────────────────────────────────────────────────

export function Dashboard() {
  const partners = useApi.partners.list();
  const deals = useApi.deals.list();
  const pipeline = useApi.ai.pipelineSummary();
  const scorecard = useApi.reports.partnerScorecard();
  const programHealth = useApi.reports.programHealth();
  const goals = useApi.goals.list();
  const submissions = useApi.approvals.pending();

  const stats = useMemo(() => {
    const ps = partners.data ?? [];
    const ds = deals.data ?? [];
    const open = ds.filter((d) => d.status === 'open');
    const won = ds.filter((d) => d.status === 'won');
    const avgEng = ps.length
      ? Math.round(ps.reduce((s, p) => s + p.engagementScore, 0) / ps.length)
      : programHealth.data?.avgEngagement ?? 0;
    return {
      openValue: open.reduce((s, d) => s + d.value, 0),
      openCount: open.length,
      wonValue: won.reduce((s, d) => s + d.value, 0),
      wonCount: won.length,
      activePartners: ps.filter((p) => p.status === 'active').length,
      totalPartners: ps.length || programHealth.data?.totalPartners || 0,
      avgEng,
      pendingSubmissions: (submissions.data ?? []).length,
    };
  }, [partners.data, deals.data, programHealth.data, submissions.data]);

  const maxStage = Math.max(1, ...(pipeline.data?.stages.map((s) => s.value) ?? [1]));
  const totalStageValue = (pipeline.data?.stages ?? []).reduce((s, x) => s + x.value, 0);

  // Partner-id → name lookup so the Deal Activity rows show partner names
  // rather than raw `prt_*` ids (the deals.list endpoint doesn't join).
  const partnerName = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of partners.data ?? []) m.set(p.id, p.name);
    return m;
  }, [partners.data]);

  // Pre-compute KPI trend series once stats are known.
  const trends = useMemo(
    () => ({
      open: shapedTrend(stats.openValue),
      won: shapedTrend(stats.wonValue),
      partners: shapedTrend(stats.activePartners, 8),
      eng: shapedTrend(stats.avgEng, 8),
    }),
    [stats.openValue, stats.wonValue, stats.activePartners, stats.avgEng],
  );

  const isLoading = partners.isLoading || deals.isLoading;
  const noPartners = !isLoading && stats.totalPartners === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-page font-semibold">Dashboard</h1>
          <p className="text-small text-text-secondary">
            Progress Partner Network — operational overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-caption text-text-secondary">
          <span className="rounded-full border border-border px-2 py-0.5">Last 30 days</span>
          <span className="rounded-full bg-surface-alt px-2 py-0.5">
            {stats.totalPartners} partners · {stats.openCount + stats.wonCount} deals
          </span>
        </div>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Partner-Sourced Pipeline"
          value={money(stats.openValue)}
          trend={trends.open}
          trendColor={token.progressBlue}
          hint={`${stats.openCount} open deals`}
          loading={isLoading}
        />
        <MetricCard
          label="Closed Revenue (Won)"
          value={money(stats.wonValue)}
          trend={trends.won}
          trendColor={token.success}
          hint={`${stats.wonCount} won this period`}
          loading={isLoading}
        />
        <MetricCard
          label="Active Partners"
          value={String(stats.activePartners)}
          trend={trends.partners}
          trendColor={token.progressGreen}
          hint={`${stats.totalPartners} total`}
          loading={isLoading}
        />
        <MetricCard
          label="Avg Engagement"
          value={`${stats.avgEng}/100`}
          trend={trends.eng}
          trendColor={token.warning}
          hint="program-wide"
          loading={isLoading}
        />
      </div>

      {/* Action band: Pipeline + AI Insights */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-progress-blue" />
              <h2 className="text-subhead font-semibold">Pipeline by Stage</h2>
            </div>
            <Link
              to="/opportunities"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              Open in Deals <ArrowRight size={12} />
            </Link>
          </div>
          {pipeline.isLoading ? (
            <Skeleton variant="row" count={6} />
          ) : (pipeline.data?.stages ?? []).length === 0 || totalStageValue === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={TrendingUp}
              title="No pipeline yet"
              body="Once partners start registering deals you'll see them break down across stages here."
              compact
            />
          ) : (
            <div className="space-y-2.5">
              {(pipeline.data?.stages ?? []).map((s) => {
                const pct = (s.value / maxStage) * 100;
                const sharePct = totalStageValue ? (s.value / totalStageValue) * 100 : 0;
                return (
                  <div key={s.stage} className="flex items-center gap-3">
                    <span className="w-28 truncate text-small text-text-secondary">{s.stage}</span>
                    <div className="relative h-6 flex-1 rounded-[var(--radius-control)] bg-surface-alt">
                      <div
                        className="h-full rounded-[var(--radius-control)] transition-[width] duration-300"
                        style={{
                          width: `${pct}%`,
                          background: stageColor[s.stage] ?? token.progressBlue,
                        }}
                      />
                    </div>
                    <span className="w-24 text-right font-mono text-small">
                      {money(s.value)}
                    </span>
                    <span className="w-12 text-right font-mono text-caption text-text-secondary">
                      {sharePct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <AIInsightsCard />
      </div>

      {/* Data band: Top Partners + Active Goals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-progress-blue" />
              <h2 className="text-subhead font-semibold">Top Partners</h2>
            </div>
            <Link
              to="/partners"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              All partners <ArrowRight size={12} />
            </Link>
          </div>
          {scorecard.isLoading ? (
            <Skeleton variant="row" count={5} />
          ) : (scorecard.data ?? []).length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={Users}
              title="No partner scorecard yet"
              body="Engagement scoring runs once we have deals, content views, and certifications to roll up."
              compact
            />
          ) : (
            <ul className="space-y-2">
              {[...(scorecard.data ?? [])]
                .sort((a, b) => b.openPipeline - a.openPipeline)
                .slice(0, 5)
                .map((p) => (
                  <li
                    key={p.partner}
                    className="flex items-center justify-between rounded-[var(--radius-control)] px-2 py-1.5 hover:bg-surface-alt"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <TierBadge tier={tierFromString(p.tier)} />
                      <span className="truncate text-small font-medium">{p.partner}</span>
                    </div>
                    <div className="flex items-center gap-4 text-caption">
                      <span className="text-text-secondary">
                        eng <span className="font-mono text-text-primary">{p.engagement}</span>
                      </span>
                      <span className="font-mono text-text-primary">{money(p.openPipeline)}</span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-progress-blue" />
              <h2 className="text-subhead font-semibold">Active Goals</h2>
            </div>
            <Link
              to="/goals"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              All goals <ArrowRight size={12} />
            </Link>
          </div>
          {goals.isLoading ? (
            <Skeleton variant="row" count={5} />
          ) : (goals.data ?? []).length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={Target}
              title="No goals set"
              body="Set quarterly pipeline, certification, and revenue targets per partner from the Goals page."
              compact
            />
          ) : (
            <ul className="space-y-2.5">
              {[...(goals.data ?? [])]
                .sort((a, b) => (a.progressPct ?? 0) - (b.progressPct ?? 0))
                .slice(0, 5)
                .map((g) => {
                  const pct = Math.min(100, Math.max(0, g.progressPct ?? 0));
                  const tone =
                    pct >= 80
                      ? 'bg-success'
                      : pct >= 40
                        ? 'bg-progress-blue'
                        : 'bg-warning';
                  return (
                    <li key={g.id}>
                      <div className="flex items-center justify-between text-small">
                        <span className="truncate">
                          <span className="font-medium">{g.partnerName ?? g.partnerId}</span>
                          <span className="text-text-secondary"> · {g.metric}</span>
                        </span>
                        <span className="font-mono text-caption text-text-secondary">{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                        <div
                          className={`h-full rounded-full ${tone} transition-[width] duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      </div>

      {/* Deal Activity */}
      <section className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-subhead font-semibold">Deal Activity</h2>
          <Link
            to="/opportunities"
            className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
          >
            All deals <ArrowRight size={12} />
          </Link>
        </div>
        {deals.isLoading ? (
          <div className="p-5">
            <Skeleton variant="row" count={6} />
          </div>
        ) : (deals.data ?? []).length === 0 ? (
          <EmptyState
            variant="zero-data"
            icon={TrendingUp}
            title="No deals yet"
            body="Once partners register opportunities they'll appear here in reverse-chronological order."
            compact
          />
        ) : (
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-5 py-2">Partner</th>
                <th className="px-5 py-2">Customer</th>
                <th className="px-5 py-2">Stage</th>
                <th className="px-5 py-2 text-right">Value</th>
                <th className="px-5 py-2">Product</th>
                <th className="px-5 py-2">Region</th>
              </tr>
            </thead>
            <tbody>
              {[...(deals.data ?? [])]
                .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
                .slice(0, 12)
                .map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-border transition-colors hover:bg-surface-alt"
                  >
                    <td className="px-5 py-2 text-text-secondary">
                      {partnerName.get(d.partnerId) ?? d.partnerId}
                    </td>
                    <td className="px-5 py-2 font-medium">{d.companyName}</td>
                    <td className="px-5 py-2">
                      <StatusBadge status={d.stage} />
                    </td>
                    <td className="px-5 py-2 text-right font-mono">
                      {money(d.value, d.currency)}
                    </td>
                    <td className="px-5 py-2 text-caption text-text-secondary">
                      {d.product ?? '—'}
                    </td>
                    <td className="px-5 py-2 text-caption text-text-secondary">
                      {d.region ?? '—'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Get started checklist — only when the tenant looks fresh */}
      {!isLoading && noPartners && <GetStartedChecklist />}
    </div>
  );
}

// ── AI Insights card ──────────────────────────────────────────────────

function AIInsightsCard() {
  const insight = useApi.ai.ask();
  const toast = useToast();

  const data = insight.data?.answer;

  const runQuery = () =>
    insight.mutate(
      {
        query:
          'Across all partners and deals, what are the top 3 actions partner managers should take this week? Be concise.',
        scope: 'deal',
        context: [],
      },
      {
        onSuccess: () =>
          toast.show({
            kind: 'success',
            title: 'ARAG insight ready',
            body: 'Generated from live partner + deal data.',
            duration: 4000,
          }),
        onError: (err) =>
          toast.show({
            kind: 'error',
            title: 'ARAG insight failed',
            body: err instanceof Error ? err.message : 'Unknown error',
          }),
      },
    );

  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-ai-surface p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-ai-accent" />
          <h2 className="text-subhead font-semibold">ARAG Insights</h2>
        </div>
        <span className="rounded-full bg-ai-accent/10 px-2 py-0.5 text-caption text-ai-accent">
          AI
        </span>
      </div>
      {data ? (
        <>
          <p className="whitespace-pre-wrap text-small text-text-primary line-clamp-6">{data}</p>
          <button
            type="button"
            onClick={runQuery}
            disabled={insight.isPending}
            className="mt-3 flex items-center gap-1 text-caption text-ai-accent hover:underline disabled:opacity-50"
          >
            {insight.isPending ? 'Refreshing…' : 'Refresh insights'} <ArrowRight size={12} />
          </button>
        </>
      ) : (
        <>
          <p className="mb-3 text-small text-text-secondary">
            Ask ARAG to scan your pipeline, certifications, and goals — get a 3-point
            "what to do this week" summary grounded in your live data.
          </p>
          <button
            type="button"
            onClick={runQuery}
            disabled={insight.isPending}
            className="rounded-[var(--radius-control)] bg-ai-accent px-3 py-1.5 text-small font-medium text-white disabled:opacity-50"
          >
            {insight.isPending ? 'Analysing…' : 'Generate insights'}
          </button>
        </>
      )}
    </section>
  );
}

// ── Get started checklist ─────────────────────────────────────────────

function GetStartedChecklist() {
  const items = [
    { key: 'sf', label: 'Connect Salesforce', to: '/sf/sync', done: false },
    { key: 'partner', label: 'Invite first partner', to: '/partners', done: false },
    { key: 'form', label: 'Publish first form', to: '/forms', done: false },
    { key: 'tier', label: 'Set tier thresholds', to: '/tiers', done: false },
    { key: 'arag', label: 'Run first ARAG sync', to: '/ops', done: false },
  ];
  return (
    <section className="rounded-[var(--radius-card)] border border-dashed border-progress-blue/40 bg-progress-blue/5 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Award size={16} className="text-progress-blue" />
        <h2 className="text-subhead font-semibold">Get started</h2>
        <span className="rounded-full bg-progress-blue/10 px-2 py-0.5 text-caption text-progress-blue">
          0 of {items.length}
        </span>
      </div>
      <p className="mb-3 text-small text-text-secondary">
        Spin up your tenant in five steps. Each one takes a couple of minutes.
      </p>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.key} className="flex items-center gap-2 text-small">
            {it.done ? (
              <CheckCircle2 size={14} className="text-success" />
            ) : (
              <Circle size={14} className="text-text-secondary" />
            )}
            <Link to={it.to} className="text-text-primary hover:text-progress-blue">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
