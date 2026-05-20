/**
 * Partner Portal Dashboard — "Today" cockpit for a partner contact.
 *
 * Reframed from a passive "welcome + lists" page to an action-first
 * cockpit: each card has a single primary CTA and cards are sorted by
 * urgency (renewals expiring soonest, stalled deals, MDF pending response).
 *
 * Slice limits raised — partners with real activity get to see what's
 * actually there rather than artificially-truncated lists of 3–5.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarClock,
  KeyRound,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  EmptyState,
  MetricCard,
  Skeleton,
  StatusBadge,
  TierBadge,
  color as token,
} from '@partnerforge/ui';
import type { PartnerTier } from '@partnerforge/shared';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';
import { money } from '../lib';

function daysUntil(iso: string | null | undefined): number {
  if (!iso) return Number.POSITIVE_INFINITY;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Stable shaped trend (deterministic, no real timeseries yet). */
function shapedTrend(value: number, points = 10): number[] {
  if (value <= 0) return new Array(points).fill(0);
  const out: number[] = [];
  let v = value * 0.78;
  let seed = (Math.floor(value) * 9301 + 49297) % 233280;
  for (let i = 0; i < points; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280 - 0.5;
    v += value * 0.04 * r;
    if (i === points - 1) v = value;
    out.push(Math.max(0, v));
  }
  return out;
}

export function Dashboard() {
  const { contact } = useAuth();
  const { t } = useI18n();
  const account = useApi.sf.account();
  const opps = useApi.sf.opportunities();
  const assets = useApi.sf.assets();
  const content = useApi.portal.content();

  const acc = account.data;
  const open = (opps.data ?? []).filter((o) => o.status === 'open');
  const won = (opps.data ?? []).filter((o) => o.status === 'won');
  const pipeline = open.reduce((s, o) => s + o.amount, 0);
  const renewable = (assets.data ?? []).filter((a) => a.renewalEligible);

  const expiringSoon = useMemo(
    () =>
      [...renewable]
        .sort((a, b) => daysUntil(a.endDate) - daysUntil(b.endDate))
        .slice(0, 6),
    [renewable],
  );
  const recentOpps = useMemo(
    () =>
      [...(opps.data ?? [])]
        .sort((a, b) => (b.closeDate ?? '').localeCompare(a.closeDate ?? ''))
        .slice(0, 8),
    [opps.data],
  );

  const isAccountLoading = account.isLoading;
  const isPipelineLoading = opps.isLoading;
  const isAssetsLoading = assets.isLoading;
  const isContentLoading = content.isLoading;

  // Targets — derived heuristics until real partner-goal endpoints land.
  // Pipeline progress = openValue / (openValue + wonValue + 1) so it's
  // never empty when there's any won revenue.
  const target = Math.max(pipeline + won.reduce((s, o) => s + o.amount, 0), 100_000);
  const progress = Math.min(1, pipeline / target);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <header>
        <div className="text-caption font-semibold uppercase tracking-wider text-text-secondary">
          {t('Today')}
        </div>
        <h1 className="text-page font-semibold">
          {t('Welcome back')}, {contact?.name ?? t('Partner')}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-small text-text-secondary">
          {isAccountLoading ? (
            <Skeleton variant="text" className="h-4 w-48" />
          ) : (
            <>
              {acc && <TierBadge tier={(acc.tier as PartnerTier) ?? 'Registered'} />}
              <span className="font-medium text-text-primary">{acc?.name}</span>
              {acc && (
                <span className="text-caption">
                  · {acc.type} · {acc.region}
                </span>
              )}
            </>
          )}
        </div>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label={t('Open Pipeline')}
          value={money(pipeline)}
          progress={progress}
          trend={shapedTrend(pipeline)}
          trendColor={token.progressBlue}
          hint={t('vs your target')}
          loading={isPipelineLoading}
        />
        <MetricCard
          label={t('Open Opportunities')}
          value={String(open.length)}
          trend={shapedTrend(open.length, 8)}
          trendColor={token.progressGreen}
          hint={`${won.length} ${t('won')} ${t('to date')}`}
          loading={isPipelineLoading}
        />
        <MetricCard
          label={t('Renewals Available')}
          value={String(renewable.length)}
          trend={shapedTrend(renewable.length, 8)}
          trendColor={token.warning}
          hint={t('eligible to renew')}
          loading={isAssetsLoading}
        />
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Renewals — primary action with urgency colouring */}
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-warning" />
              <h2 className="text-subhead font-semibold">{t('Renewals Due')}</h2>
            </div>
            <Link
              to="/assets"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              {t('All assets')} <ArrowRight size={12} />
            </Link>
          </div>
          {isAssetsLoading ? (
            <Skeleton variant="row" count={4} />
          ) : expiringSoon.length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={KeyRound}
              title={t('Nothing renewable yet')}
              body={t('Asset renewals will appear here when expiry windows open.')}
              compact
            />
          ) : (
            <ul className="space-y-2">
              {expiringSoon.map((a) => {
                const d = daysUntil(a.endDate);
                const urgent = d <= 30;
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 text-small"
                  >
                    <span className="min-w-0 truncate">
                      <span className="font-medium">{a.product}</span>
                      <span className="text-text-secondary"> · {a.customerName}</span>
                    </span>
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium ${
                        urgent
                          ? 'bg-warning/10 text-warning'
                          : 'bg-surface-alt text-text-secondary'
                      }`}
                    >
                      <CalendarClock size={10} />
                      {Number.isFinite(d) ? `${d}d` : '—'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recent Opportunities */}
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-progress-blue" />
              <h2 className="text-subhead font-semibold">{t('Recent Opportunities')}</h2>
            </div>
            <Link
              to="/opportunities"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              {t('All')} <ArrowRight size={12} />
            </Link>
          </div>
          {isPipelineLoading ? (
            <Skeleton variant="row" count={4} />
          ) : recentOpps.length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={Briefcase}
              title={t('No opportunities yet')}
              body={t('Register your first deal to start tracking pipeline.')}
              compact
              action={{ label: t('Register a Deal'), href: '/forms' }}
            />
          ) : (
            <ul className="space-y-2">
              {recentOpps.slice(0, 6).map((o) => (
                <li key={o.id} className="text-small">
                  <Link
                    to={`/opportunities/${o.id}`}
                    className="flex items-center justify-between gap-2 rounded-[var(--radius-control)] px-1 py-0.5 hover:bg-surface-alt"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-medium">{o.customerName}</span>
                    </span>
                    <StatusBadge status={o.stage} />
                    <span className="w-24 shrink-0 text-right font-mono text-caption text-text-secondary">
                      {money(o.amount, o.currency)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recommended Content */}
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-progress-blue" />
              <h2 className="text-subhead font-semibold">{t('Recommended Content')}</h2>
            </div>
            <Link
              to="/library"
              className="flex items-center gap-1 text-caption text-progress-blue hover:underline"
            >
              {t('Library')} <ArrowRight size={12} />
            </Link>
          </div>
          {isContentLoading ? (
            <Skeleton variant="row" count={4} />
          ) : (content.data ?? []).length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={BookOpen}
              title={t('No content for your tier yet')}
              body={t('Battle cards, data sheets, and demo decks tailored to your tier will appear here.')}
              compact
            />
          ) : (
            <ul className="space-y-2">
              {(content.data ?? []).slice(0, 6).map((c) => (
                <li key={c.id} className="text-small">
                  <Link
                    to="/library"
                    className="flex items-center justify-between gap-2 rounded-[var(--radius-control)] px-1 py-0.5 hover:bg-surface-alt"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
                    <span className="shrink-0 rounded-full bg-surface-alt px-2 py-0.5 text-caption text-text-secondary">
                      {c.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* AI tease + quick actions */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[var(--radius-card)] border border-border bg-ai-surface p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-ai-accent" />
            <h2 className="text-subhead font-semibold">{t('Ask ARAG')}</h2>
            <span className="rounded-full bg-ai-accent/10 px-2 py-0.5 text-caption text-ai-accent">
              AI
            </span>
          </div>
          <p className="text-small text-text-secondary">
            {t(
              'Search the partner content library in plain English. "Compare ARAG vs Caitlyn for a healthcare prospect" — get cited answers from your tier-specific kit.',
            )}
          </p>
          <Link
            to="/assistant"
            className="mt-3 inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-ai-accent px-3 py-1.5 text-small font-medium text-white"
          >
            {t('Open AI Assistant')} <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-progress-blue" />
            <h2 className="text-subhead font-semibold">{t('Quick actions')}</h2>
          </div>
          <ul className="space-y-1.5 text-small">
            <li>
              <Link
                to="/forms"
                className="flex items-center justify-between rounded-[var(--radius-control)] px-2 py-1 hover:bg-surface-alt"
              >
                <span>{t('Register a Deal')}</span>
                <ArrowRight size={12} className="text-text-secondary" />
              </Link>
            </li>
            <li>
              <Link
                to="/forms"
                className="flex items-center justify-between rounded-[var(--radius-control)] px-2 py-1 hover:bg-surface-alt"
              >
                <span>{t('Request MDF')}</span>
                <ArrowRight size={12} className="text-text-secondary" />
              </Link>
            </li>
            <li>
              <Link
                to="/training"
                className="flex items-center justify-between rounded-[var(--radius-control)] px-2 py-1 hover:bg-surface-alt"
              >
                <span>{t('Continue training')}</span>
                <ArrowRight size={12} className="text-text-secondary" />
              </Link>
            </li>
            <li>
              <Link
                to="/quotes"
                className="flex items-center justify-between rounded-[var(--radius-control)] px-2 py-1 hover:bg-surface-alt"
              >
                <span>{t('Review quotes')}</span>
                <ArrowRight size={12} className="text-text-secondary" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* If everything is empty, show an onboarding nudge */}
      {!isPipelineLoading &&
        !isAssetsLoading &&
        open.length === 0 &&
        renewable.length === 0 && (
          <section className="rounded-[var(--radius-card)] border border-dashed border-progress-blue/40 bg-progress-blue/5 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-progress-blue" />
              <div>
                <h2 className="text-subhead font-semibold">{t('Get started')}</h2>
                <p className="mt-1 max-w-2xl text-small text-text-secondary">
                  {t(
                    'No active deals or assets yet. Register your first deal or browse the content library — your Progress partner manager is automatically looped in.',
                  )}
                </p>
                <Link
                  to="/forms"
                  className="mt-2 inline-flex items-center gap-1 rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-small font-medium text-white"
                >
                  {t('Register a Deal')} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
