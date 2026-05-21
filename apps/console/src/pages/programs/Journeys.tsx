/**
 * Journeys — partner lifecycle funnel.
 *
 * Derived from partners.status. Each stage shows the count + the
 * partners at that stage. The at-risk cohort is the prompt for staff
 * action; clicking a partner navigates to their detail page.
 */
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import { useApi } from '../../api/hooks';
import { ScopeBar } from '../../components/ScopeBar';
import { scopeParams, useScope } from '../../scope';

const STAGE_LABEL: Record<string, string> = {
  onboarding: 'Onboarding',
  active: 'Active',
  at_risk: 'At risk',
  churned: 'Churned',
};

const STAGE_TONE: Record<string, string> = {
  onboarding: 'border-progress-blue/30 bg-ai-surface',
  active: 'border-success/30 bg-success/10',
  at_risk: 'border-warning/30 bg-warning/10',
  churned: 'border-danger/30 bg-danger/10',
};

export function Journeys(): ReactElement {
  const scope = useScope();
  const journeys = useApi.journeys.list();
  // journeys.list is BU-enforced server-side for restricted users; for the
  // admin picker we narrow the funnel client-side against the scoped partner
  // set (the journeys payload carries no BU column of its own).
  const scopedPartners = useApi.partners.list(scopeParams(scope));
  const allowedIds = useMemo(
    () => new Set((scopedPartners.data ?? []).map((p) => p.id)),
    [scopedPartners.data],
  );
  const narrowing = !!scope.businessUnit || !!scope.region || !!scope.product;
  const stages = useMemo(() => {
    const raw = journeys.data ?? [];
    if (!narrowing) return raw;
    return raw.map((s) => {
      const partners = s.partners.filter((p) => allowedIds.has(p.id));
      return { ...s, partners, count: partners.length };
    });
  }, [journeys.data, narrowing, allowedIds]);
  const total = stages.reduce((s, x) => s + x.count, 0);
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Programs
        </div>
        <h1 className="font-heading text-h1 font-semibold">Journeys</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Partner lifecycle funnel — every partner sits in exactly one stage
          based on their status. Click any partner to open their detail
          page. Multi-step playbooks (recipes staff run with a partner) land
          as their own editor in the next milestone.
        </p>
      </div>

      <ScopeBar />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((s) => {
          const pct = total ? Math.round((s.count / total) * 100) : 0;
          return (
            <div
              key={s.stage}
              className={`rounded-[var(--radius-card)] border p-5 ${STAGE_TONE[s.stage] ?? 'bg-surface'}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <GitBranch size={16} className="text-text-secondary" />
                <span className="font-medium">{STAGE_LABEL[s.stage] ?? s.stage}</span>
              </div>
              <div className="font-mono text-h1 font-semibold">{s.count}</div>
              <div className="text-caption text-text-secondary">{pct}% of partners</div>
              {s.partners.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {s.partners.map((p) => (
                    <li key={p.id} className="text-small">
                      <Link
                        to={`/partners/${p.id}`}
                        className="block rounded px-2 py-1 hover:bg-surface"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium">{p.name}</span>
                          <span className="rounded-full bg-surface-alt px-1.5 py-0.5 text-caption">
                            {p.tier}
                          </span>
                        </div>
                        <div className="text-caption text-text-secondary">
                          eng {p.engagementScore} · churn {p.churnRiskScore}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
