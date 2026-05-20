/**
 * Content Library — partner-facing surface for battle cards, data sheets,
 * playbooks, demo scripts, and (new) video content. Items are filtered to
 * the partner's tier by the API; the page just renders.
 *
 * Filter rail lets the partner switch between All / Documents / Videos.
 * Videos render as VideoCards that link to /library/video/:id (Watch page).
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';
import { VideoCard } from '@partnerforge/ui';
import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';

type Tab = 'all' | 'documents' | 'videos';

export function Library() {
  const { t } = useI18n();
  const all = useApi.portal.content();
  const account = useApi.sf.account();
  const sharepoint = useApi.adminConfig.sharepointAssets();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('all');

  // Gate semantic search behind 2-char threshold (was: enabled flag).
  const search = useApi.portal.searchContent({
    query: q.trim().length > 2 ? q : '',
    limit: 15,
  });
  const semantic = q.trim().length > 2;

  const acc = account.data;
  const assets = (sharepoint.data ?? []).filter(
    (b) =>
      !acc ||
      ((b.region === acc.region || b.region === 'Global') &&
        (acc.productCoverage.includes(b.productFamily) || b.productFamily === 'All')),
  );

  // Partition + filter by the tab.
  const items = all.data ?? [];
  const filtered = useMemo(() => {
    if (tab === 'documents') return items.filter((c) => c.mediaType !== 'video');
    if (tab === 'videos') return items.filter((c) => c.mediaType === 'video');
    return items;
  }, [items, tab]);
  const videoCount = items.filter((c) => c.mediaType === 'video').length;
  const docCount = items.length - videoCount;

  return (
    <div className="pf-fade-in space-y-5 pb-12">
      <div>
        <div className="pf-eyebrow">{t('Library')}</div>
        <h1 className="mt-1">{t('Content Library')}</h1>
        <p className="mt-1 max-w-2xl text-[13px] text-ink-3">
          {t(
            'Battle cards, data sheets, playbooks, and on-demand video. Search uses ARAG so questions in plain English work as well as keywords.',
          )}
        </p>
      </div>

      {/* Search bar with violet AI sparkle to signal ARAG */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(
            'Search naturally — e.g. competitive positioning against ServiceNow for healthcare',
          )}
          className="w-full rounded-md border border-border-strong bg-surface py-2.5 pl-10 pr-3 text-[14px] text-ink-1 outline-none transition-[border-color,box-shadow] focus:border-brand-500 focus:shadow-[var(--shadow-ring)]"
        />
      </div>

      {/* Filter chip rail — All / Documents / Videos */}
      {!semantic && (
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ['all', t('All'), items.length],
              ['documents', t('Documents'), docCount],
              ['videos', t('Videos'), videoCount],
            ] as Array<[Tab, string, number]>
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors ${
                tab === key
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-border bg-surface text-ink-2 hover:border-border-strong hover:text-ink-1'
              }`}
            >
              {label}
              <span className={tab === key ? 'text-brand-600' : 'text-ink-3'}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Semantic-search results (replaces the grid when q > 2 chars) */}
      {semantic ? (
        <div className="space-y-2">
          <p className="text-[12px] text-ink-3">
            {t('ARAG semantic results')} {search.isFetching ? t('(searching…)') : ''}
          </p>
          {(search.data?.hits ?? []).map((h) => (
            <div key={h.resourceId} className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-4">
              <div className="font-medium text-ink-1">{h.title}</div>
              {h.snippet && <p className="mt-1 line-clamp-2 text-[13px] text-ink-3">{h.snippet}</p>}
            </div>
          ))}
          {search.data && search.data.hits.length === 0 && (
            <p className="text-[13px] text-ink-3">{t('No matches.')}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) =>
            c.mediaType === 'video' ? (
              <VideoCard
                key={c.id}
                href={`/library/video/${c.id}`}
                title={c.title}
                description={c.description}
                thumbnailUrl={c.thumbnailUrl}
                durationSeconds={c.durationSeconds}
                typeChip="Video"
              />
            ) : (
              <Link
                key={c.id}
                to={`/library`}
                className="pf-card-hover block rounded-[var(--radius-lg)] border border-border bg-surface p-4 no-underline"
              >
                <span className="pf-eyebrow">{c.type}</span>
                <div className="mt-1 font-medium text-ink-1">{c.title}</div>
                {c.description && (
                  <p className="mt-1 line-clamp-3 text-[12.5px] text-ink-3">{c.description}</p>
                )}
              </Link>
            ),
          )}
          {filtered.length === 0 && (
            <p className="text-[13px] text-ink-3">{t('No content available for your tier.')}</p>
          )}
        </div>
      )}

      {assets.length > 0 && (
        <section className="mt-2">
          <h2 className="mb-2">{t('Brand Assets (SharePoint)')}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((b) => (
              <a
                key={b.url}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="pf-card-hover flex items-center justify-between rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-[13px] no-underline"
              >
                <span>
                  <span className="font-medium text-ink-1">{b.title}</span>
                  <span className="block text-[11px] text-ink-3">
                    {b.productFamily} · {b.region}
                  </span>
                </span>
                <ExternalLink size={14} className="text-ink-3" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
