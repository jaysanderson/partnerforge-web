import { MetricCard, TierBadge } from '@partnerforge/ui';
import type { PartnerTier } from '@partnerforge/shared';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';
import { money, shortDate } from '../lib';

export function Dashboard() {
  const { contact } = useAuth();
  const { t } = useI18n();
  const account = useApi.sf.account();
  const opps = useApi.sf.opportunities();
  const assets = useApi.sf.assets();
  const content = useApi.portal.content();

  const acc = account.data;
  const open = (opps.data ?? []).filter((o) => o.status === 'open');
  const pipeline = open.reduce((s, o) => s + o.amount, 0);
  const renewable = (assets.data ?? []).filter((a) => a.renewalEligible);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page font-semibold">
          {t('Welcome back')}, {contact?.name ?? t('Partner')}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-small text-text-secondary">
          {acc && <TierBadge tier={acc.tier as PartnerTier} />}
          <span>{acc?.name}</span>
          {acc && (
            <span className="text-caption">
              · {acc.type} · {acc.region}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label={t('Open Pipeline')} value={money(pipeline)} progress={0.55} />
        <MetricCard label={t('Open Opportunities')} value={String(open.length)} />
        <MetricCard label={t('Renewals Available')} value={String(renewable.length)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title={t('Action Items')}>
          <ul className="space-y-2 text-small">
            {renewable.slice(0, 3).map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>
                  {t('Renew')} {a.product} {t('for')} {a.customerName}
                </span>
                <span className="text-text-secondary">{shortDate(a.endDate)}</span>
              </li>
            ))}
            {renewable.length === 0 && (
              <li className="text-text-secondary">{t('Nothing needs attention right now.')}</li>
            )}
          </ul>
        </Panel>
        <Panel title={t('Recommended Content')}>
          <ul className="space-y-2 text-small">
            {(content.data ?? []).slice(0, 5).map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.title}</span>
                <span className="text-caption text-text-secondary">{c.type}</span>
              </li>
            ))}
            {(content.data ?? []).length === 0 && (
              <li className="text-text-secondary">{t('No content for your tier yet.')}</li>
            )}
          </ul>
        </Panel>
      </div>

      <Panel title={t('Recent Opportunities')}>
        <ul className="space-y-2 text-small">
          {(opps.data ?? []).slice(0, 5).map((o) => (
            <li key={o.id} className="flex justify-between">
              <span>
                {o.customerName} <span className="text-text-secondary">· {o.stage}</span>
              </span>
              <span className="font-mono text-text-secondary">{money(o.amount, o.currency)}</span>
            </li>
          ))}
          {(opps.data ?? []).length === 0 && (
            <li className="text-text-secondary">{t('No opportunities yet.')}</li>
          )}
        </ul>
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-3 text-subhead font-semibold">{title}</h2>
      {children}
    </div>
  );
}
