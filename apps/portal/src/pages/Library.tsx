import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';

export function Library() {
  const { t } = useI18n();
  const all = useApi.portal.content();
  const account = useApi.sf.account();
  const sharepoint = useApi.adminConfig.sharepointAssets();
  const [q, setQ] = useState('');
  // Gate semantic search behind 2-char threshold (was: enabled flag).
  const search = useApi.portal.searchContent({
    query: q.trim().length > 2 ? q : '',
    limit: 15,
  });

  const semantic = q.trim().length > 2;
  const acc = account.data;
  // Attribute-based asset access (R2/R3/R4): region + product coverage.
  const assets = (sharepoint.data ?? []).filter(
    (b) =>
      !acc ||
      ((b.region === acc.region || b.region === 'Global') &&
        (acc.productCoverage.includes(b.productFamily) || b.productFamily === 'All')),
  );

  return (
    <div className="space-y-4">
      <h1 >{t('Content Library')}</h1>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(
            'Search naturally — e.g. competitive positioning against ServiceNow for healthcare',
          )}
          className="w-full rounded-[var(--radius-control)] border border-border bg-surface py-2.5 pl-10 pr-3 text-body outline-none focus:border-border-focus"
        />
      </div>

      {semantic ? (
        <div className="space-y-2">
          <p className="text-caption text-text-secondary">
            {t('ARAG semantic results')} {search.isFetching ? t('(searching…)') : ''}
          </p>
          {(search.data?.hits ?? []).map((h) => (
            <div
              key={h.resourceId}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-4"
            >
              <div className="font-medium">{h.title}</div>
              {h.snippet && (
                <p className="mt-1 line-clamp-2 text-small text-text-secondary">{h.snippet}</p>
              )}
            </div>
          ))}
          {search.data && search.data.hits.length === 0 && (
            <p className="text-small text-text-secondary">{t('No matches.')}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(all.data ?? []).map((c) => (
            <div
              key={c.id}
              className="rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
            >
              <span className="text-caption text-text-secondary">{c.type}</span>
              <div className="mt-1 font-medium">{c.title}</div>
              {c.description && (
                <p className="mt-1 line-clamp-3 text-small text-text-secondary">{c.description}</p>
              )}
            </div>
          ))}
          {(all.data ?? []).length === 0 && (
            <p className="text-small text-text-secondary">
              {t('No content available for your tier.')}
            </p>
          )}
        </div>
      )}

      {assets.length > 0 && (
        <section>
          <h2 className="mb-2 mt-2 text-subhead font-semibold">{t('Brand Assets (SharePoint)')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((b) => (
              <a
                key={b.url}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[var(--radius-card)] border border-border bg-surface p-4 text-small hover:border-progress-blue"
              >
                <span>
                  <span className="font-medium">{b.title}</span>
                  <span className="block text-caption text-text-secondary">
                    {b.productFamily} · {b.region}
                  </span>
                </span>
                <ExternalLink size={14} className="text-text-secondary" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
