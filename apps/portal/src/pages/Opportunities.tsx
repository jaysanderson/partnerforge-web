import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from '@partnerforge/ui';
import { useI18n } from '../i18n';
import { useApi, useApiUtils } from '../api/hooks';
import { money, shortDate } from '../lib';

export function Opportunities() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const opps = useApi.sf.opportunities();
  const fields = useApi.sf.fieldMeta();

  const labels = Object.fromEntries(
    (fields.data ?? []).map((m) => [m.apiName, m.partnerLabel]),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-page font-semibold">{t('Opportunities')}</h1>
        <button
          type="button"
          onClick={() => navigate('/forms')}
          className="rounded-[var(--radius-control)] bg-progress-red px-4 py-2 text-small font-medium text-white"
        >
          {t('Register a Deal')}
        </button>
      </div>

      <table className="w-full rounded-[var(--radius-card)] border border-border bg-surface text-body">
        <thead>
          <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
            <th className="px-4 py-2">{t(labels.customerName ?? 'Customer')}</th>
            <th className="px-4 py-2">{t(labels.product ?? 'Product')}</th>
            <th className="px-4 py-2">{t(labels.stage ?? 'Stage')}</th>
            <th className="px-4 py-2 text-right">{t(labels.amount ?? 'Value')}</th>
            <th className="px-4 py-2">{t(labels.closeDate ?? 'Close')}</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {(opps.data ?? []).map((o) => (
            <tr key={o.id} className="border-t border-border">
              <td className="px-4 py-2.5">{o.customerName}</td>
              <td className="px-4 py-2.5">{o.product}</td>
              <td className="px-4 py-2.5">
                <StatusBadge status={o.stage} />
              </td>
              <td className="px-4 py-2.5 text-right font-mono">{money(o.amount, o.currency)}</td>
              <td className="px-4 py-2.5 text-text-secondary">{shortDate(o.closeDate)}</td>
              <td className="px-4 py-2.5 text-right">
                <Link
                  to={`/opportunities/${o.id}`}
                  className="text-small text-progress-blue hover:underline"
                >
                  {t('Open')}
                </Link>
              </td>
            </tr>
          ))}
          {(opps.data ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-small text-text-secondary">
                {t('No opportunities.')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function OpportunityDetail() {
  const { id = '' } = useParams();
  const { t } = useI18n();
  const q = useApi.sf.opportunity({ id });
  if (q.isLoading) return <p className="text-small text-text-secondary">{t('Loading…')}</p>;
  if (q.error || !q.data) return <p className="text-small text-danger">{t('Not found.')}</p>;
  const o = q.data;
  return (
    <div className="space-y-5">
      <Link to="/opportunities" className="text-caption text-text-secondary hover:text-progress-blue">
        ← {t('Opportunities')}
      </Link>
      <div className="flex items-center gap-3">
        <h1 className="text-page font-semibold">{o.customerName}</h1>
        <StatusBadge status={o.stage} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Detail k={t('Opportunity')} v={o.name} />
        <Detail k={t('Deal Value')} v={money(o.amount, o.currency)} />
        <Detail k={t('Product')} v={o.product} />
        <Detail k={t('Expected Close')} v={shortDate(o.closeDate)} />
        <Detail k={t('Progress Owner')} v={o.ownerName} />
        <Detail k={t('Customer Contact')} v={o.contactName ?? '—'} />
      </div>

      <section>
        <h2 className="mb-2 text-subhead font-semibold">{t('Line Items')}</h2>
        <table className="w-full rounded-[var(--radius-card)] border border-border bg-surface text-body">
          <thead>
            <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
              <th className="px-4 py-2">{t('SKU')}</th>
              <th className="px-4 py-2">{t('Product')}</th>
              <th className="px-4 py-2 text-right">{t('Qty')}</th>
              <th className="px-4 py-2 text-right">{t('Unit Price')}</th>
            </tr>
          </thead>
          <tbody>
            {o.lineItems.map((li) => (
              <tr key={li.sku} className="border-t border-border">
                <td className="px-4 py-2 font-mono text-small">{li.sku}</td>
                <td className="px-4 py-2">{li.name}</td>
                <td className="px-4 py-2 text-right">{li.quantity}</td>
                <td className="px-4 py-2 text-right font-mono">{money(li.unitPrice)}</td>
              </tr>
            ))}
            {o.lineItems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-small text-text-secondary">
                  {t('No line items.')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-2 text-subhead font-semibold">{t('Quotes & Files')}</h2>
        <ul className="space-y-2">
          {o.quotes.map((qt) => (
            <li
              key={qt.id}
              className="flex items-center justify-between rounded-[var(--radius-card)] border border-border bg-surface p-3 text-small"
            >
              <span>
                {qt.fileName}{' '}
                <span className="text-text-secondary">· {money(qt.amount, qt.currency)}</span>
              </span>
              <a
                href={qt.fileUrl}
                className="text-progress-blue hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {t('Download')}
              </a>
            </li>
          ))}
          {o.quotes.length === 0 && (
            <li className="text-small text-text-secondary">{t('No quote files yet.')}</li>
          )}
        </ul>
      </section>

      <Collaboration recordId={o.id} />
    </div>
  );
}

function Collaboration({ recordId }: { recordId: string }) {
  const { t } = useI18n();
  const utils = useApiUtils();
  const thread = useApi.collaboration.list({ recordType: 'opportunity', recordId });
  const add = useApi.collaboration.add();
  const [body, setBody] = useState('');

  return (
    <section>
      <h2 className="mb-2 text-subhead font-semibold">{t('Collaboration')}</h2>
      <div className="space-y-2">
        {(thread.data ?? []).map((c) => (
          <div
            key={c.id}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-3 text-small"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {c.authorName}{' '}
                <span className="text-caption text-text-secondary">({c.authorType})</span>
              </span>
              <span className="text-caption text-text-secondary">
                {shortDate(c.createdAt)} {c.syncedToSf && `· ${t('synced to Salesforce')}`}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{c.body}</p>
            {c.mentions.length > 0 && (
              <p className="mt-1 text-caption text-ai-accent">@ {c.mentions.join(', @')}</p>
            )}
          </div>
        ))}
        {(thread.data ?? []).length === 0 && (
          <p className="text-small text-text-secondary">
            {t('No messages yet. @mention a Progress contact to loop them in.')}
          </p>
        )}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) {
            add.mutate(
              { recordType: 'opportunity', recordId, body },
              {
                onSuccess: () => {
                  utils.collaboration.list.invalidate();
                  setBody('');
                },
              },
            );
          }
        }}
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('Add a comment… use @name to tag someone')}
          className="flex-1 rounded-[var(--radius-control)] border border-border px-3 py-2 text-body outline-none focus:border-border-focus"
        />
        <button
          type="submit"
          disabled={add.isPending}
          className="rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white disabled:opacity-50"
        >
          {t('Post')}
        </button>
      </form>
    </section>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-3">
      <div className="text-caption text-text-secondary">{k}</div>
      <div className="mt-0.5 font-medium">{v}</div>
    </div>
  );
}
