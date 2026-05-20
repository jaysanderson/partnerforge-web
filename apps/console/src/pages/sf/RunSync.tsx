/**
 * Salesforce → Run sync.
 *
 * Trigger the full ARAG ingest manually. Same backend call the cron
 * makes every hour. Returns counts of partners / deals / content items
 * mirrored to ARAG. Useful right before a demo or after bulk SF edits.
 */
import { useState, type ReactElement } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useApi, useApiUtils } from '../../api/hooks';

export function SfRunSync(): ReactElement {
  const utils = useApiUtils();
  const sync = useApi.system.syncRunAll();
  const [last, setLast] = useState<{ ok: boolean; text: string } | null>(null);

  const run = () => {
    setLast(null);
    sync.mutate(undefined, {
      onSuccess: (r) => {
        setLast({
          ok: true,
          text: `${r.partners} partners · ${r.deals} deals · ${r.content} content items projected to ARAG.`,
        });
        void utils.system.cacheStats.invalidate();
      },
      onError: (e) => setLast({ ok: false, text: (e as Error).message }),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure → Salesforce
        </div>
        <h1 className="font-heading text-h1 font-semibold">Run sync</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Project the current state of PartnerForge (which mirrors
          Salesforce) into the ARAG Knowledge Boxes so AI search + Q&amp;A
          reflect the latest data. The cron does this every hour; trigger
          now after a bulk Salesforce import.
        </p>
      </div>

      {last && (
        <div
          className={`flex items-start gap-3 rounded-[var(--radius-card)] border p-4 ${
            last.ok ? 'border-success/30 bg-success/10' : 'border-danger/30 bg-danger/10'
          }`}
        >
          {last.ok ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
          )}
          <div className="font-medium">
            {last.ok ? 'Sync complete' : 'Sync failed'}
            <div className="font-normal text-small text-text-secondary">{last.text}</div>
          </div>
        </div>
      )}

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-2 font-heading text-h3 font-semibold">ARAG ingest</h2>
        <p className="mb-4 text-small text-text-secondary">
          Pushes every partner, deal, and content item into the three
          Knowledge Boxes (partner / deal / enablement). Idempotent —
          rows are upserted by slug, so re-running is safe.
        </p>
        <button
          type="button"
          onClick={run}
          disabled={sync.isPending}
          className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white disabled:opacity-50"
        >
          <RefreshCw size={14} className={sync.isPending ? 'animate-spin' : ''} />
          {sync.isPending ? 'Syncing…' : 'Run sync now'}
        </button>
        <div className="mt-3 font-mono text-caption text-text-secondary">
          POST /v1/system/sync
        </div>
      </section>
    </div>
  );
}
