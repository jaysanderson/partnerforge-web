/**
 * Salesforce → Connection.
 *
 * The "where you start" page for the SF integration. Surfaces three
 * concerns in one read:
 *   1. Connector status — mock / live-stub / live-real, with a
 *      one-sentence explanation of what that means.
 *   2. Environment variables — read-only checklist of which SF env
 *      vars are set on the API machine. Never displays the values.
 *      Credentials live in `fly secrets` (or local `.env`); the
 *      Console deliberately has no form for entering them.
 *   3. Demo override — toggle `sf.useMockInLive` so Live mode can be
 *      demoed without a real Salesforce org. Persisted in the DB so
 *      it survives redeploys.
 *
 * "Test connection" probes the currently-resolved adapter end-to-end
 * (round-trip + 5 s timeout in the real-live path).
 */
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Check, CircleSlash, Plug, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@partnerforge/ui';
import { useApi, useApiUtils } from '../../api/hooks';

type ConnectorKind = 'mock' | 'live-stub' | 'live-real';

const CONNECTOR_TONE: Record<
  ConnectorKind,
  { label: string; pill: string; explain: string }
> = {
  mock: {
    label: 'Mock connector',
    pill: 'bg-warning-50 text-warning-600 border-warning-600/30',
    explain:
      'PartnerForge is reading the in-memory Salesforce mock. No real Salesforce calls are being made. Good for demos, local dev, and UAT without a sandbox.',
  },
  'live-stub': {
    label: 'Live stub (not implemented)',
    pill: 'bg-danger-50 text-danger-600 border-danger-600/30',
    explain:
      'Live mode is active but the real Salesforce connector is not yet implemented — any adapter call will throw. Switch to Demo or enable the mock-in-Live override below.',
  },
  'live-real': {
    label: 'Live connector',
    pill: 'bg-success-50 text-success-600 border-success-600/30',
    explain:
      'PartnerForge is talking to your real Salesforce org. The hourly sync and every adapter-backed page hits Salesforce REST/Bulk APIs.',
  },
};

export function SfConnection(): ReactElement {
  const toast = useToast();
  const utils = useApiUtils();
  const sfQuery = useApi.adminConfig.salesforceConfig();
  const setUseMockInLive = useApi.adminConfig.setUseMockInLive();
  const testConnection = useApi.adminConfig.testSalesforceConnection();
  const [lastTest, setLastTest] = useState<{
    ok: boolean;
    kind: string;
    latencyMs?: number;
    errorMessage?: string;
  } | null>(null);

  if (sfQuery.isLoading) {
    return (
      <div className="space-y-2">
        <h1>Salesforce — Connection</h1>
        <p className="pf-small text-ink-3">Loading…</p>
      </div>
    );
  }
  if (sfQuery.error || !sfQuery.data) {
    return (
      <div className="space-y-2">
        <h1>Salesforce — Connection</h1>
        <p className="pf-small text-danger-600">
          {sfQuery.error?.message ?? 'Could not load Salesforce config.'} — admin only.
        </p>
      </div>
    );
  }

  const cfg = sfQuery.data;
  const tone = CONNECTOR_TONE[cfg.connector as ConnectorKind];

  const handleTest = () => {
    testConnection.mutate(undefined, {
      onSuccess: (res) => {
        setLastTest(res);
        if (res.ok) {
          toast.show({
            kind: 'success',
            title: `Connection OK (${res.kind})`,
            body:
              res.latencyMs && res.latencyMs > 0
                ? `Round-trip ${res.latencyMs} ms.`
                : 'Mock connector responded instantly.',
          });
        } else {
          toast.show({
            kind: 'error',
            title: 'Connection failed',
            body: res.errorMessage ?? 'Unknown error.',
          });
        }
      },
      onError: (err: Error) =>
        toast.show({ kind: 'error', title: 'Probe failed', body: err.message }),
    });
  };

  const handleMockToggle = (next: boolean) => {
    setUseMockInLive.mutate(
      { value: next },
      {
        onSuccess: () => {
          utils.adminConfig.salesforceConfig.invalidate();
          toast.show({
            kind: 'success',
            title: next ? 'Mock-in-Live enabled' : 'Mock-in-Live disabled',
            body: next
              ? 'Live mode now uses the mock Salesforce adapter.'
              : 'Live mode will now require real Salesforce credentials.',
          });
        },
        onError: (err: Error) =>
          toast.show({ kind: 'error', title: 'Could not save', body: err.message }),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="pf-micro text-ink-3">CONFIGURE / SALESFORCE</p>
        <h1>Connection</h1>
        <p className="pf-small text-ink-2">
          One screen for "is Salesforce wired up correctly?" — connector status, env vars,
          and the demo-override switch.
        </p>
      </div>

      {/* Connector status */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-subtle p-2 text-ink-3">
            <Plug size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="mb-1">Connector status</h2>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium ${tone.pill}`}
              >
                {tone.label}
              </span>
              <span className="pf-small text-ink-3">
                Mode: <span className="text-ink-1 font-medium">{cfg.mode}</span>
              </span>
              {cfg.useMockInLive && (
                <span className="pf-small text-ink-3">· Mock-in-Live: on</span>
              )}
            </div>
            <p className="pf-small text-ink-2">{tone.explain}</p>
          </div>
        </div>
      </Card>

      {/* Env vars checklist */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-subtle p-2 text-ink-3">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="mb-1">Environment variables</h2>
            <p className="pf-small text-ink-2 mb-3">
              PartnerForge never stores Salesforce credentials in the database. Set these via{' '}
              <code className="rounded bg-subtle px-1.5 py-0.5">fly secrets set</code> on the
              API machine, then redeploy.
            </p>
            <ul className="space-y-1.5">
              <EnvRow name="SALESFORCE_BASE_URL" present={cfg.envPresent.baseUrl} />
              <EnvRow name="SALESFORCE_USERNAME" present={cfg.envPresent.username} />
              <EnvRow name="SALESFORCE_PASSWORD" present={cfg.envPresent.password} />
            </ul>
          </div>
        </div>
      </Card>

      {/* Demo override */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-subtle p-2 text-ink-3">
            <Zap size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="mb-1">Demo override</h2>
            <p className="pf-small text-ink-2 mb-3">
              When this is on, Live mode resolves to the mock adapter — useful for showing
              Live UX in demos without a real Salesforce org. Persisted in the database, so
              it survives redeploys. The boot-time{' '}
              <code className="rounded bg-subtle px-1.5 py-0.5">SF_USE_MOCK_IN_LIVE</code> env
              var is the fallback default; this toggle wins at runtime.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={cfg.useMockInLive}
                onChange={(e) => handleMockToggle(e.target.checked)}
                disabled={setUseMockInLive.isPending}
              />
              <span>
                <span className="pf-small font-medium text-ink-1">Use mock data in Live mode</span>
                <span className="block pf-small text-ink-3">
                  Recommended while the real Salesforce connector is still a stub.
                </span>
              </span>
            </label>
          </div>
        </div>
      </Card>

      {/* Test connection */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleTest}
          disabled={testConnection.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 pf-small font-medium text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
        >
          {testConnection.isPending ? 'Testing…' : 'Test connection'}
        </button>
        {lastTest && (
          <span className="pf-small text-ink-3">
            Last test:{' '}
            <span className={lastTest.ok ? 'text-success-600' : 'text-danger-600'}>
              {lastTest.ok ? 'ok' : 'failed'}
            </span>{' '}
            ({lastTest.kind}
            {lastTest.latencyMs && lastTest.latencyMs > 0 ? `, ${lastTest.latencyMs} ms` : ''})
            {lastTest.errorMessage ? ` — ${lastTest.errorMessage}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}

function EnvRow({ name, present }: { name: string; present: boolean }): ReactElement {
  return (
    <li className="flex items-center gap-2 pf-small">
      {present ? (
        <Check size={16} className="text-success-600" />
      ) : (
        <CircleSlash size={16} className="text-ink-3" />
      )}
      <code className="font-mono">{name}</code>
      <span className="text-ink-3">{present ? 'set' : 'not set'}</span>
    </li>
  );
}

function Card({ children }: { children: React.ReactNode }): ReactElement {
  return <div className="pf-card p-5">{children}</div>;
}
