/**
 * Operations — manual triggers + Salesforce cache observability.
 *
 * Replaces the placeholder from PR7. Surfaces the things the cron does
 * automatically (sync + intel runs) so staff can trigger them on demand,
 * plus a freshness view of the SF read-through cache with per-entity
 * "Refresh from Salesforce" buttons (the PR_SF4 piece).
 *
 * Every action here is a single REST call documented at /docs.
 */
import { useState, type ReactElement } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { useApi, useApiUtils } from '../api/hooks';

type Mode = 'demo' | 'live';

function ageString(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return 'unknown';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function Operations(): ReactElement {
  const utils = useApiUtils();
  const mode = useApi.adminConfig.mode();
  const cacheStats = useApi.system.cacheStats();
  const sync = useApi.system.syncRunAll();
  const cacheRefresh = useApi.system.cacheRefresh();

  // Last-action banner. Cleared when a new action starts.
  const [lastResult, setLastResult] = useState<{
    ok: boolean;
    label: string;
    detail: string;
  } | null>(null);

  const runSync = () => {
    setLastResult(null);
    sync.mutate(undefined, {
      onSuccess: (r) => {
        setLastResult({
          ok: true,
          label: 'ARAG ingest complete',
          detail: `${r.partners} partners · ${r.deals} deals · ${r.content} content items pushed to ARAG.`,
        });
        void utils.system.cacheStats.invalidate();
      },
      onError: (e) =>
        setLastResult({ ok: false, label: 'Sync failed', detail: (e as Error).message }),
    });
  };

  const refreshCache = (entity: 'partner' | 'opportunity' | 'contact' | 'all') => {
    setLastResult(null);
    cacheRefresh.mutate(
      { entity },
      {
        onSuccess: (r) => {
          const cleared = Object.entries(r.cleared)
            .map(([k, v]) => `${v} ${k}`)
            .join(', ');
          setLastResult({
            ok: true,
            label: `Cache invalidated (${entity})`,
            detail: `Cleared ${cleared || 'no rows'}. Next read fetches from Salesforce.`,
          });
          void utils.system.cacheStats.invalidate();
          void utils.partners.list.invalidate();
          void utils.deals.list.invalidate();
        },
        onError: (e) =>
          setLastResult({
            ok: false,
            label: 'Cache invalidation failed',
            detail: (e as Error).message,
          }),
      },
    );
  };

  const m: Mode = (mode.data?.mode ?? 'demo') as Mode;
  const stats = cacheStats.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Operations
          </div>
          <h1 className="font-heading text-h1 font-semibold">Operations</h1>
          <p className="mt-1 max-w-2xl text-body text-text-secondary">
            Manual triggers + Salesforce cache observability. Same procedures
            the cron runs (hourly ARAG sync, 4-hourly intel) — fired on demand.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-caption font-semibold uppercase ${
            m === 'live' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}
          title={
            m === 'live'
              ? 'Live mode — real Salesforce / SharePoint connectors'
              : 'Demo mode — mock data; no SF API calls'
          }
        >
          {m} mode
        </span>
      </div>

      {lastResult && (
        <div
          className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 ${
            lastResult.ok
              ? 'border-success/30 bg-success/10'
              : 'border-danger/30 bg-danger/10'
          }`}
        >
          {lastResult.ok ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
          )}
          <div>
            <div className="font-medium">{lastResult.label}</div>
            <div className="text-small text-text-secondary">{lastResult.detail}</div>
          </div>
        </div>
      )}

      {/* ARAG sync */}
      <section className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center gap-2">
          <Activity size={18} className="text-progress-blue" />
          <h2 className="font-heading text-h3 font-semibold">ARAG ingest</h2>
        </div>
        <p className="mb-4 text-small text-text-secondary">
          Project all partners / deals / content into the ARAG Knowledge Boxes
          so AI search + Q&amp;A reflect the current state. The cron does this
          every hour; trigger now after a bulk import or before a demo.
        </p>
        <button
          type="button"
          onClick={runSync}
          disabled={sync.isPending}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white disabled:opacity-50"
        >
          <RefreshCw size={14} className={sync.isPending ? 'animate-spin' : ''} />
          {sync.isPending ? 'Syncing…' : 'Run ARAG sync now'}
        </button>
        <div className="mt-2 font-mono text-caption text-text-secondary">
          POST /v1/system/sync
        </div>
      </section>

      {/* SF cache observability */}
      <section className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center gap-2">
          <Database size={18} className="text-progress-blue" />
          <h2 className="font-heading text-h3 font-semibold">Salesforce cache</h2>
        </div>
        <p className="mb-4 text-small text-text-secondary">
          Salesforce is the source of truth for Accounts / Contacts /
          Opportunities; the local DB is a TTL-bounded read-through cache.
          Invalidate an entity below to force the next read to re-fetch from
          SF. In demo mode the cache is bypassed entirely (mock adapter).
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CacheEntityCard
            label="Partners"
            entity="partner"
            stats={stats?.partners}
            onRefresh={() => refreshCache('partner')}
            disabled={cacheRefresh.isPending}
          />
          <CacheEntityCard
            label="Opportunities"
            entity="opportunity"
            stats={stats?.deals}
            onRefresh={() => refreshCache('opportunity')}
            disabled={cacheRefresh.isPending}
          />
          <CacheEntityCard
            label="Contacts"
            entity="contact"
            stats={stats?.partnerContacts}
            onRefresh={() => refreshCache('contact')}
            disabled={cacheRefresh.isPending}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => refreshCache('all')}
            disabled={cacheRefresh.isPending}
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Refresh all
          </button>
          <div className="font-mono text-caption text-text-secondary">
            GET /v1/system/cache-stats · POST /v1/system/cache-refresh
          </div>
        </div>
      </section>

      <p className="text-caption text-text-secondary">
        Looking for the intel pipeline (engagement, insights, conflict
        scanning)? The cron handles it every 4 hours. Manual triggers will
        land here in the next pass.
        <Wrench size={12} className="ml-1 inline" />
      </p>
    </div>
  );
}

interface CacheStat {
  total: number;
  synced: number;
  oldestSync: string | null;
}

interface CacheEntityCardProps {
  label: string;
  entity: string;
  stats: CacheStat | undefined;
  onRefresh: () => void;
  disabled: boolean;
}

function CacheEntityCard({
  label,
  entity,
  stats,
  onRefresh,
  disabled,
}: CacheEntityCardProps): ReactElement {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface-alt p-4">
      <div className="flex items-center justify-between">
        <span className="text-small font-medium">{label}</span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={disabled}
          title={`Refresh ${entity} cache`}
          className="text-text-secondary hover:text-progress-blue disabled:opacity-50"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="mt-2 space-y-1 text-small">
        <Row k="Total rows" v={stats ? String(stats.total) : '—'} />
        <Row k="Synced from SF" v={stats ? String(stats.synced) : '—'} />
        <Row k="Oldest sync" v={stats ? ageString(stats.oldestSync) : '—'} />
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }): ReactElement {
  return (
    <div className="flex justify-between text-caption">
      <span className="text-text-secondary">{k}</span>
      <span className="font-mono text-text-primary">{v}</span>
    </div>
  );
}
