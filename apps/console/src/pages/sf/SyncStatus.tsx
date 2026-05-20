/**
 * Salesforce → Sync status.
 *
 * Focused, SF-themed view of the same cache stats the Operations page
 * surfaces. Same `/v1/system/cache-stats` endpoint underneath. Demo
 * story: "we don't duplicate SF data — these counters show how much of
 * what's in PartnerForge is a live mirror of the SF org."
 */
import type { ReactElement } from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { useApi, useApiUtils } from '../../api/hooks';

function ageString(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return 'unknown';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export function SfSyncStatus(): ReactElement {
  const utils = useApiUtils();
  const stats = useApi.system.cacheStats();
  const mode = useApi.adminConfig.mode();
  const refresh = useApi.system.cacheRefresh();

  const trigger = (entity: 'partner' | 'opportunity' | 'contact' | 'all') =>
    refresh.mutate(
      { entity },
      { onSuccess: () => void utils.system.cacheStats.invalidate() },
    );

  const m = mode.data?.mode ?? 'demo';
  const s = stats.data;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure → Salesforce
        </div>
        <h1 className="font-heading text-h1 font-semibold">Sync status</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          PartnerForge holds a TTL-bounded read-through cache of the
          Salesforce Account / Contact / Opportunity records the platform
          uses. Salesforce remains the source of truth; the cache exists
          to keep page loads fast and stay within rate limits.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-2.5 py-1 text-caption">
          Mode:{' '}
          <span className={m === 'live' ? 'text-success' : 'text-warning'}>{m}</span>
        </div>
      </div>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center gap-2">
          <Database size={18} className="text-progress-blue" />
          <h2 className="font-heading text-h3 font-semibold">Cache freshness</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(['partners', 'deals', 'partnerContacts'] as const).map((k) => {
            const stat = s?.[k];
            const label =
              k === 'partners'
                ? 'Accounts'
                : k === 'deals'
                  ? 'Opportunities'
                  : 'Contacts';
            return (
              <div
                key={k}
                className="rounded-[var(--radius-card)] border border-border bg-surface-alt p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-small font-medium">{label}</span>
                  <button
                    type="button"
                    onClick={() =>
                      trigger(
                        k === 'partners'
                          ? 'partner'
                          : k === 'deals'
                            ? 'opportunity'
                            : 'contact',
                      )
                    }
                    disabled={refresh.isPending}
                    aria-label={`Refresh ${label}`}
                    className="text-text-secondary hover:text-progress-blue disabled:opacity-50"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <dl className="mt-2 space-y-1 text-caption">
                  <Row k="Cached rows" v={stat ? String(stat.total) : '—'} />
                  <Row k="Mirrored from SF" v={stat ? String(stat.synced) : '—'} />
                  <Row k="Oldest sync" v={stat ? ageString(stat.oldestSync) : '—'} />
                </dl>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => trigger('all')}
          disabled={refresh.isPending}
          className="mt-3 inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-small font-medium text-white disabled:opacity-50"
        >
          <RefreshCw size={14} className={refresh.isPending ? 'animate-spin' : ''} />
          Refresh all from Salesforce
        </button>
        <div className="mt-2 font-mono text-caption text-text-secondary">
          GET /v1/system/cache-stats · POST /v1/system/cache-refresh
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }): ReactElement {
  return (
    <div className="flex justify-between">
      <dt className="text-text-secondary">{k}</dt>
      <dd className="font-mono">{v}</dd>
    </div>
  );
}
