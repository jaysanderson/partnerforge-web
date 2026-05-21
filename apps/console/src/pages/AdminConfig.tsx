import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, useToast } from '@partnerforge/ui';
import { useApi, useApiUtils } from '../api/hooks';

/** Narrow no-code config: runtime mode (demo/live), partner-facing field
 *  labels/visibility, and the SharePoint brand-asset surface. Changes apply
 *  live (read by sf.fieldMeta / portal / mode-aware adapters). */
export function AdminConfig() {
  const utils = useApiUtils();
  const fields = useApi.adminConfig.oppFieldOverrides();
  const brand = useApi.adminConfig.sharepointAssets();
  const setFields = useApi.adminConfig.setOppFieldOverrides();
  const setBrand = useApi.adminConfig.setSharepointAssets();

  const [fJson, setFJson] = useState('');
  const [bJson, setBJson] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (fields.data) setFJson(JSON.stringify(fields.data, null, 2));
  }, [fields.data]);
  useEffect(() => {
    if (brand.data) setBJson(JSON.stringify(brand.data, null, 2));
  }, [brand.data]);

  if (fields.error) {
    return (
      <div className="space-y-2">
        <h1>Configuration</h1>
        <p className="pf-small text-danger-600">{fields.error.message} — admin only.</p>
      </div>
    );
  }

  const save = (which: 'fields' | 'brand') => {
    setErr(null);
    try {
      if (which === 'fields') {
        setFields.mutate(JSON.parse(fJson), {
          onSuccess: () => utils.adminConfig.oppFieldOverrides.invalidate(),
        });
      } else {
        setBrand.mutate(JSON.parse(bJson), {
          onSuccess: () => utils.adminConfig.sharepointAssets.invalidate(),
        });
      }
    } catch {
      setErr('Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="pf-micro text-ink-3">CONFIGURE</p>
        <h1>Portal settings</h1>
        <p className="pf-small text-ink-2">
          Business-admin settings — no engineering required. Changes apply immediately across the
          partner experience.
        </p>
      </div>

      <RuntimeModeCard />

      <Card title="Opportunity field labels & visibility (R28/R29)">
        <textarea
          value={fJson}
          onChange={(e) => setFJson(e.target.value)}
          rows={8}
          className="w-full rounded-md border border-border bg-subtle p-3 font-mono text-[0.8125rem]"
        />
        <button
          type="button"
          onClick={() => save('fields')}
          disabled={setFields.isPending}
          className="mt-2 rounded-md bg-brand-600 px-4 py-1.5 pf-small font-medium text-white disabled:opacity-50"
        >
          {setFields.isPending ? 'Saving…' : 'Save & apply live'}
        </button>
      </Card>

      <Card title="SharePoint brand assets (R2) — surfaced in the partner Content Library">
        <textarea
          value={bJson}
          onChange={(e) => setBJson(e.target.value)}
          rows={10}
          className="w-full rounded-md border border-border bg-subtle p-3 font-mono text-[0.8125rem]"
        />
        <button
          type="button"
          onClick={() => save('brand')}
          disabled={setBrand.isPending}
          className="mt-2 rounded-md bg-brand-600 px-4 py-1.5 pf-small font-medium text-white disabled:opacity-50"
        >
          {setBrand.isPending ? 'Saving…' : 'Save & apply live'}
        </button>
      </Card>
      {err && <p className="pf-small text-danger-600">{err}</p>}
    </div>
  );
}

/**
 * Demo / Live segmented control. Hooks the existing `setMode` mutation and
 * guards Live mode behind the mock-fallback toggle when the real Salesforce
 * connector isn't wired — without that guard, switching to Live would crash
 * every adapter-backed read (`liveAdapter()` is a Proxy stub that throws).
 */
function RuntimeModeCard() {
  const toast = useToast();
  const navigate = useNavigate();
  const sfQuery = useApi.adminConfig.salesforceConfig();
  const setMode = useApi.adminConfig.setMode();
  const setUseMockInLive = useApi.adminConfig.setUseMockInLive();

  const cfg = sfQuery.data;
  const mode = cfg?.mode ?? 'demo';
  const realCredsPresent =
    !!cfg?.envPresent.baseUrl && !!cfg?.envPresent.username && !!cfg?.envPresent.password;
  const liveSafe = cfg?.useMockInLive || (realCredsPresent && cfg?.connector !== 'live-stub');

  const switchTo = (next: 'demo' | 'live') => {
    if (next === mode) return;
    setMode.mutate(
      { mode: next },
      {
        onSuccess: () => {
          toast.show({
            kind: 'success',
            title:
              next === 'live'
                ? cfg?.useMockInLive
                  ? 'Mode switched to Live (using mock SF data).'
                  : 'Mode switched to Live.'
                : 'Mode switched to Demo.',
            body: 'Top-bar chip and the hourly cron will pick up the new mode immediately.',
          });
        },
        onError: (err: Error) =>
          toast.show({ kind: 'error', title: 'Could not switch mode', body: err.message }),
      },
    );
  };

  const enableMockAndGoLive = () => {
    setUseMockInLive.mutate(
      { value: true },
      {
        onSuccess: () => switchTo('live'),
        onError: (err: Error) =>
          toast.show({ kind: 'error', title: 'Could not enable mock-in-Live', body: err.message }),
      },
    );
  };

  if (sfQuery.isLoading) {
    return (
      <Card title="Runtime mode">
        <p className="pf-small text-ink-3">Loading…</p>
      </Card>
    );
  }

  return (
    <Card title="Runtime mode">
      <p className="pf-small text-ink-2 mb-3">
        Demo uses an in-memory mock of Salesforce + SharePoint. Live talks to the real
        connectors. Switching here takes effect immediately — the top-bar chip and the
        hourly cron pick up the new mode on their next read.
      </p>
      <div className="flex gap-2 mb-3">
        <ModeButton
          label="Demo"
          desc="Mock adapters"
          active={mode === 'demo'}
          onClick={() => switchTo('demo')}
        />
        <ModeButton
          label="Live"
          desc={cfg?.useMockInLive ? 'Mock fallback on' : 'Real connectors'}
          active={mode === 'live'}
          onClick={() => switchTo('live')}
        />
      </div>

      {mode === 'live' && !liveSafe && (
        <div className="mt-2">
          <EmptyState
            variant="coming-soon"
            compact
            title="Live Salesforce isn't connected"
            body="No Salesforce credentials are configured and the live connector is a stub. Switching here will crash every adapter-backed page until that's fixed. Flip 'Use mock in Live' first to demo Live mode without real Salesforce."
            action={{
              label: 'Use mock SF in Live',
              onClick: enableMockAndGoLive,
            }}
            secondaryAction={{
              label: 'Open Salesforce settings',
              onClick: () => navigate('/sf/connection'),
            }}
          />
        </div>
      )}

      {mode === 'demo' && !realCredsPresent && !cfg?.useMockInLive && (
        <p className="pf-small text-ink-3 mt-2">
          Tip: before flipping to Live, set <code>SALESFORCE_BASE_URL</code>,{' '}
          <code>SALESFORCE_USERNAME</code>, and <code>SALESFORCE_PASSWORD</code> via{' '}
          <code>fly secrets set</code>, or visit{' '}
          <Link to="/sf/connection" className="text-brand-600 underline">
            Salesforce → Connection
          </Link>{' '}
          to enable the mock-in-Live override.
        </p>
      )}
    </Card>
  );
}

function ModeButton({
  label,
  desc,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'flex-1 rounded-lg border px-4 py-3 text-left transition-colors',
        active
          ? 'border-brand-600 bg-brand-50 text-ink-1 shadow-sm'
          : 'border-border bg-surface text-ink-2 hover:bg-subtle',
      ].join(' ')}
    >
      <div className="pf-small font-semibold">{label}</div>
      <div className="pf-micro text-ink-3 mt-0.5">{desc}</div>
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pf-card p-5">
      <h2 className="mb-3">{title}</h2>
      {children}
    </div>
  );
}
