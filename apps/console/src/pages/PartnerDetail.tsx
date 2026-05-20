import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { MetricCard, StatusBadge, TierBadge } from '@partnerforge/ui';
import type { PartnerTier } from '@partnerforge/shared';
import { useApi } from '../api/hooks';
import { money, shortDate } from '../lib/format';

const TABS = ['Deals', 'Insights', 'Profile'] as const;
type Tab = (typeof TABS)[number];

export function PartnerDetail() {
  const { id = '' } = useParams();
  const [tab, setTab] = useState<Tab>('Deals');
  const partner = useApi.partners.get({ id });
  const deals = useApi.deals.list({ partnerId: id });
  const insights = useApi.ai.insightsForPartner({ partnerId: id });

  if (partner.isLoading) return <p className="text-small text-text-secondary">Loading…</p>;
  if (partner.error || !partner.data)
    return <p className="text-small text-danger">Partner not found.</p>;
  const p = partner.data;
  const ds = deals.data ?? [];
  const openValue = ds.filter((d) => d.status === 'open').reduce((s, d) => s + d.value, 0);
  const wonValue = ds.filter((d) => d.status === 'won').reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link to="/partners" className="text-caption text-text-secondary hover:text-progress-blue">
          ← Partners
        </Link>
        <div className="mt-1 flex items-center gap-3">
          <h1 >{p.name}</h1>
          <TierBadge tier={p.tier as PartnerTier} />
          <StatusBadge status={p.status} />
          <span className="text-small text-text-secondary">
            {p.type} · {p.region}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open Pipeline" value={money(openValue)} />
        <MetricCard label="Closed Revenue" value={money(wonValue)} />
        <MetricCard label="Engagement" value={`${p.engagementScore}/100`} />
        <MetricCard label="Churn Risk" value={`${p.churnRiskScore}/100`} />
      </div>

      <div className="rounded-[var(--radius-card)] border border-border bg-ai-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-ai-accent" />
          <span className="text-subhead font-semibold">AI Insight</span>
        </div>
        {insights.data && insights.data.length > 0 ? (
          <p className="whitespace-pre-wrap text-small">{insights.data[0]?.insightText}</p>
        ) : (
          <p className="text-small text-text-secondary">
            No current insight. The intelligence job generates these every 4 hours.
          </p>
        )}
      </div>

      <div>
        <div className="flex gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-small ${
                tab === t
                  ? 'border-b-2 border-progress-blue font-medium text-text-primary'
                  : 'text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Deals' && (
          <table className="mt-3 w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2 text-right">Value</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {ds.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-3 py-2">{d.companyName}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={d.stage} />
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{money(d.value, d.currency)}</td>
                  <td className="px-3 py-2 text-text-secondary">{shortDate(d.updatedAt)}</td>
                </tr>
              ))}
              {ds.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-small text-text-secondary">
                    No deals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {tab === 'Insights' && (
          <div className="mt-3 space-y-2">
            {(insights.data ?? []).map((i) => (
              <div
                key={i.id}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-3 text-small"
              >
                <p className="whitespace-pre-wrap">{i.insightText}</p>
                <p className="mt-1 text-caption text-text-secondary">
                  Generated {shortDate(i.generatedAt)} · relevance {i.relevanceScore}
                </p>
              </div>
            ))}
            {(insights.data ?? []).length === 0 && (
              <p className="text-small text-text-secondary">No insights cached.</p>
            )}
          </div>
        )}

        {tab === 'Profile' && (
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-body sm:grid-cols-2">
            <Field k="Primary contact" v={p.primaryContactName ?? '—'} />
            <Field k="Contact email" v={p.primaryContactEmail ?? '—'} />
            <Field k="Domain" v={p.domain ?? '—'} />
            <Field k="Onboarded" v={shortDate(p.onboardedAt)} />
            <Field k="CRM id" v={p.crmId ?? '—'} />
            <Field k="Updated" v={shortDate(p.updatedAt)} />
          </dl>
        )}
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-1.5">
      <dt className="text-text-secondary">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
