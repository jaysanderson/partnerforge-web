/**
 * Salesforce → Connection: the integration hub + guided setup wizard.
 *
 *  - Not connected → 5-step wizard (Connect → Objects → Map fields →
 *    Sync settings → Review).
 *  - Connected + activated → a summary (org, environment, last sync) with
 *    Manage / Sync now / Disconnect.
 *  - Connected but not yet activated (returned from OAuth) → wizard resumes
 *    at the Objects step.
 *
 * Tokens never reach the browser — OAuth completes server-side; this page
 * only ever sees the redacted integration config.
 */
import { useEffect, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Cloud,
  Database,
  Plug,
  RefreshCw,
  Workflow,
} from 'lucide-react';
import { useToast } from '@partnerforge/ui';
import { useApi } from '../../api/hooks';

type Integration = ReturnType<typeof useApi.adminConfig.salesforceIntegration>['data'];
type SfObject = 'account' | 'contact' | 'opportunity';

const STEPS = ['Connect', 'Objects', 'Map fields', 'Sync settings', 'Review'] as const;

// PartnerForge target fields per object (mirrors the schema columns).
const PF_FIELDS: Record<SfObject, string[]> = {
  account: ['name', 'domain', 'tier', 'type', 'region', 'businessUnit', 'status'],
  contact: ['name', 'email', 'role'],
  opportunity: ['companyName', 'value', 'stage', 'status', 'product', 'region', 'closeDate'],
};

// Auto-suggest: PartnerForge field → preferred Salesforce API name(s).
const ALIASES: Record<string, string[]> = {
  name: ['Name'],
  domain: ['Website'],
  tier: ['Tier__c'],
  type: ['Type'],
  region: ['Region__c', 'BillingCountry'],
  businessUnit: ['BusinessUnit__c'],
  email: ['Email'],
  role: ['Title'],
  companyName: ['Name'],
  value: ['Amount'],
  stage: ['StageName'],
  product: ['Product__c'],
  closeDate: ['CloseDate'],
};

function suggestSfField(pfField: string, sfFields: { name: string }[]): string {
  const aliases = ALIASES[pfField] ?? [];
  for (const a of aliases) if (sfFields.some((f) => f.name === a)) return a;
  return '';
}

export function SfConnection(): ReactElement {
  const q = useApi.adminConfig.salesforceIntegration();
  const cfg = q.data;

  if (q.isLoading || !cfg) {
    return (
      <div className="space-y-2">
        <h1>Salesforce — Connection</h1>
        <p className="pf-small text-ink-3">Loading…</p>
      </div>
    );
  }

  const activated = !!cfg.connection.activatedAt;
  return activated ? <ConnectedSummary cfg={cfg} /> : <Wizard cfg={cfg} />;
}

/* ── Connected summary ───────────────────────────────────────────────── */

function ConnectedSummary({ cfg }: { cfg: NonNullable<Integration> }): ReactElement {
  const toast = useToast();
  const navigate = useNavigate();
  const cacheStats = useApi.system.cacheStats();
  const syncNow = useApi.system.syncRunAll();
  const disconnect = useApi.adminConfig.salesforceDisconnect();
  const resetDemo = useApi.adminConfig.resetToDemoData();

  const oldestSync = cacheStats.data?.partners.oldestSync ?? null;
  const lastSync = oldestSync
    ? `${Math.round((Date.now() - new Date(oldestSync).getTime()) / 60000)}m ago`
    : 'just now';

  return (
    <div className="space-y-6">
      <div>
        <p className="pf-micro text-ink-3">CONFIGURE / SALESFORCE</p>
        <h1>Connection</h1>
      </div>

      <div className="pf-card p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-success-50 p-2 text-success-600">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="mb-0">Connected</h2>
              <span className="inline-flex items-center rounded-full border border-success-600/30 bg-success-50 px-2.5 py-0.5 text-[0.75rem] font-medium text-success-600">
                {cfg.connection.environment}
              </span>
              {!cfg.connection.real && (
                <span className="pf-micro text-ink-3">· simulated</span>
              )}
            </div>
            <p className="pf-small text-ink-2 mt-1">
              <span className="font-medium text-ink-1">{cfg.connection.orgName}</span>
              {' · '}
              {cfg.connection.instanceUrl}
            </p>
            <p className="pf-small text-ink-3 mt-0.5">
              Last sync {lastSync} · {cfg.sync.frequency.replace('_', ' ')} ·{' '}
              {cfg.sync.conflictPolicy.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              syncNow.mutate(undefined, {
                onSuccess: () => toast.show({ kind: 'success', title: 'Sync started' }),
                onError: (e: Error) => toast.show({ kind: 'error', title: 'Sync failed', body: e.message }),
              })
            }
            disabled={syncNow.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 pf-small font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncNow.isPending ? 'animate-spin' : ''} /> Sync now
          </button>
          <button
            type="button"
            onClick={() => navigate('/sf/sync')}
            className="rounded-md border border-border bg-surface px-4 py-2 pf-small font-medium text-ink-1 hover:bg-subtle"
          >
            Sync status
          </button>
          <button
            type="button"
            onClick={() =>
              disconnect.mutate(undefined, {
                onSuccess: () =>
                  toast.show({ kind: 'success', title: 'Disconnected from Salesforce' }),
              })
            }
            disabled={disconnect.isPending}
            className="rounded-md border border-danger-600/40 bg-surface px-4 py-2 pf-small font-medium text-danger-600 hover:bg-danger-50 disabled:opacity-50"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="pf-card p-5">
        <h2 className="mb-2">What's syncing</h2>
        <ul className="pf-small text-ink-2 space-y-1">
          <li>Accounts → Partners {cfg.objects.accounts.enabled ? '✓' : '— off'}{cfg.objects.accounts.filter ? ` (where ${cfg.objects.accounts.filter})` : ''}</li>
          <li>Contacts {cfg.objects.contacts.enabled ? '✓' : '— off'}</li>
          <li>Opportunities → Deals {cfg.objects.opportunities.enabled ? '✓' : '— off'}</li>
        </ul>
        <p className="pf-small text-ink-3 mt-3">
          Re-run the setup wizard by disconnecting and reconnecting, or adjust field
          visibility under Field mappings.
        </p>
      </div>

      {/* Escape hatch back to the sandbox demo dataset. */}
      <div className="pf-card p-5">
        <h2 className="mb-1">Demo data</h2>
        <p className="pf-small text-ink-2 mb-3">
          {cfg.connection.real
            ? 'A real org is connected, so the demo partners and deals were removed. Reset to restore the sandbox demo dataset (this disconnects Salesforce).'
            : 'Reset restores the seeded demo partners, deals, and content.'}
        </p>
        <button
          type="button"
          onClick={() =>
            resetDemo.mutate(undefined, {
              onSuccess: () => toast.show({ kind: 'success', title: 'Reset to demo data' }),
              onError: (e: Error) => toast.show({ kind: 'error', title: 'Reset failed', body: e.message }),
            })
          }
          disabled={resetDemo.isPending}
          className="rounded-md border border-border bg-surface px-4 py-2 pf-small font-medium text-ink-1 hover:bg-subtle disabled:opacity-50"
        >
          {resetDemo.isPending ? 'Resetting…' : 'Reset to demo data'}
        </button>
      </div>
    </div>
  );
}

/* ── Wizard ──────────────────────────────────────────────────────────── */

function Wizard({ cfg }: { cfg: NonNullable<Integration> }): ReactElement {
  // Always start at Connect so the connection step is visible and gives clear
  // feedback (✓ Connected) — even when returning from OAuth.
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <p className="pf-micro text-ink-3">CONFIGURE / SALESFORCE</p>
        <h1>Connect Salesforce</h1>
        <p className="pf-small text-ink-2">
          Five quick steps to mirror your Salesforce org into PartnerForge.
        </p>
      </div>

      <Stepper step={step} />

      {step === 0 && <StepConnect cfg={cfg} onNext={() => setStep(1)} />}
      {step === 1 && <StepObjects cfg={cfg} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <StepFieldMap cfg={cfg} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepSyncSettings cfg={cfg} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepReview cfg={cfg} onBack={() => setStep(3)} />}
    </div>
  );
}

function Stepper({ step }: { step: number }): ReactElement {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span
            className={[
              'flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-semibold',
              i < step
                ? 'bg-success-600 text-white'
                : i === step
                  ? 'bg-brand-600 text-white'
                  : 'bg-subtle text-ink-3',
            ].join(' ')}
          >
            {i < step ? '✓' : i + 1}
          </span>
          <span className={`pf-small ${i === step ? 'text-ink-1 font-medium' : 'text-ink-3'}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="text-ink-4">·</span>}
        </li>
      ))}
    </ol>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}): ReactElement {
  return (
    <div className="flex justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border bg-surface px-4 py-2 pf-small font-medium text-ink-1 hover:bg-subtle"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="rounded-md bg-brand-600 px-4 py-2 pf-small font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

/* Step 1 — Connect (OAuth) */
function StepConnect({
  cfg,
  onNext,
}: {
  cfg: NonNullable<Integration>;
  onNext: () => void;
}): ReactElement {
  const toast = useToast();
  const navigate = useNavigate();
  const start = useApi.adminConfig.salesforceOAuthStart();
  const appQ = useApi.adminConfig.salesforceConnectedApp();
  const disconnect = useApi.adminConfig.salesforceDisconnect();
  const [editingApp, setEditingApp] = useState(false);
  // A genuine, real-org connection — not the leftover simulated demo one.
  const realConnected = cfg.status === 'connected' && cfg.connection.real;
  // Connected to the simulated demo provider (no real org behind it).
  const simConnected = cfg.status === 'connected' && !cfg.connection.real;
  const appConfigured = appQ.data?.configured ?? false;

  const connect = (environment: 'production' | 'sandbox') => {
    const redirectUri = `${window.location.origin}/console/sf/oauth/callback`;
    start.mutate(
      { environment, redirectUri },
      {
        onSuccess: (res) => {
          if (res.simulated) {
            // Show a believable Salesforce consent screen before "connecting".
            // Carry `state` so the (server-side) completion can match it.
            navigate(`/sf/oauth/authorize?environment=${environment}&state=${encodeURIComponent(res.state)}`);
          } else {
            // Real Connected App → hand off to Salesforce.
            window.location.href = res.authorizeUrl;
          }
        },
        onError: (e: Error) => toast.show({ kind: 'error', title: 'Could not start OAuth', body: e.message }),
      },
    );
  };

  // A real org is connected → confirmation card + Continue, plus Disconnect.
  if (realConnected) {
    return (
      <div className="space-y-4">
        <div className="pf-card p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-success-50 p-2 text-success-600">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="mb-1">Connected to Salesforce</h2>
              <p className="pf-small text-ink-2">
                <span className="font-medium text-ink-1">{cfg.connection.orgName}</span> (
                {cfg.connection.environment})
              </p>
              <p className="pf-small text-ink-3 mt-1">{cfg.connection.instanceUrl}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                disconnect.mutate(undefined, {
                  onSuccess: () =>
                    toast.show({ kind: 'success', title: 'Disconnected from Salesforce' }),
                })
              }
              disabled={disconnect.isPending}
              className="rounded-md border border-danger-600/40 bg-surface px-3 py-1.5 pf-small font-medium text-danger-600 hover:bg-danger-50 disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>
        </div>
        <StepNav onNext={onNext} nextLabel="Continue" />
      </div>
    );
  }

  // A simulated demo connection (or none) sits behind the credentials form
  // below — surface a banner so the user knows they're on the demo and can
  // either add their real Connected App or carry on with the demo.
  const demoBanner = simConnected ? (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warning-600/30 bg-warning-50 px-4 py-3">
      <p className="pf-small text-ink-2">
        You're on a <span className="font-medium text-ink-1">simulated demo connection</span> — add
        your Connected App below to connect a real org.
      </p>
      <button
        type="button"
        onClick={onNext}
        className="pf-small font-medium text-brand-600 underline whitespace-nowrap"
      >
        Continue with demo →
      </button>
    </div>
  ) : null;

  // No Connected App yet (or editing) → collect the org's app credentials so
  // we can do a REAL OAuth handshake. Without these we'd only have the demo.
  if (!appConfigured || editingApp) {
    return (
      <div className="space-y-4">
        {demoBanner}
        <ConnectedAppForm onSaved={() => setEditingApp(false)} loginUrl={appQ.data?.loginUrl} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {demoBanner}
      <div className="pf-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="mb-1">Connect your Salesforce org</h2>
            <p className="pf-small text-ink-2">
              You'll be redirected to Salesforce to authorize PartnerForge. We never see or
              store your password — only a secure token, kept on the server.
            </p>
          </div>
        </div>
        <p className="pf-micro text-ink-3">
          Using your Connected App
          {appQ.data?.clientIdLast4 ? ` (••••${appQ.data.clientIdLast4})` : ''} ·{' '}
          <button type="button" className="text-brand-600 underline" onClick={() => setEditingApp(true)}>
            edit
          </button>
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <EnvCard
            title="Production"
            desc={appQ.data?.loginUrl || 'login.salesforce.com'}
            icon={<Cloud size={20} />}
            onClick={() => connect('production')}
            disabled={start.isPending}
          />
          <EnvCard
            title="Sandbox"
            desc={appQ.data?.loginUrl || 'test.salesforce.com'}
            icon={<Database size={20} />}
            onClick={() => connect('sandbox')}
            disabled={start.isPending}
          />
        </div>
      </div>
    </div>
  );
}

/** Collect the org's Connected App credentials so OAuth can hit a real org. */
function ConnectedAppForm({
  onSaved,
  loginUrl,
}: {
  onSaved: () => void;
  loginUrl?: string;
}): ReactElement {
  const toast = useToast();
  const save = useApi.adminConfig.setSalesforceConnectedApp();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [domain, setDomain] = useState(loginUrl ?? '');
  const callbackUrl = `${window.location.origin}/console/sf/oauth/callback`;
  const [copied, setCopied] = useState(false);

  const submit = () => {
    save.mutate(
      { clientId: clientId.trim(), clientSecret: clientSecret.trim(), loginUrl: domain.trim() },
      {
        onSuccess: () => {
          toast.show({ kind: 'success', title: 'Connected App saved' });
          onSaved();
        },
        onError: (e: Error) => toast.show({ kind: 'error', title: 'Could not save', body: e.message }),
      },
    );
  };

  return (
    <div className="pf-card p-5 space-y-4">
      <div>
        <h2 className="mb-1">Add your Salesforce Connected App</h2>
        <p className="pf-small text-ink-2">
          To connect a real org, create a Connected App in Salesforce
          (Setup → App Manager → New Connected App), enable OAuth, and paste its credentials
          here. We store the secret on the server only.
        </p>
      </div>

      <div className="rounded-lg bg-subtle p-3">
        <p className="pf-micro text-ink-3 mb-1">Use this as the Connected App's Callback URL:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-surface px-2 py-1 pf-small">{callbackUrl}</code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(callbackUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-md border border-border bg-surface px-2 py-1 pf-small hover:bg-subtle"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <Labeled label="Consumer Key (Client ID)">
        <input
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="3MVG9..."
          className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-[0.8125rem]"
        />
      </Labeled>
      <Labeled label="Consumer Secret (Client Secret)">
        <input
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="••••••••••••"
          className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-[0.8125rem]"
        />
      </Labeled>
      <Labeled label="My Domain login URL (optional — defaults to test/login.salesforce.com)">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="https://yourorg--sandbox.my.salesforce.com"
          className="w-full rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-[0.8125rem]"
        />
      </Labeled>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={save.isPending || !clientId.trim() || !clientSecret.trim()}
          className="rounded-md bg-brand-600 px-4 py-2 pf-small font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {save.isPending ? 'Saving…' : 'Save & continue'}
        </button>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: ReactElement }): ReactElement {
  return (
    <label className="block">
      <span className="pf-small font-medium text-ink-1">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function EnvCard({
  title,
  desc,
  icon,
  onClick,
  disabled,
}: {
  title: string;
  desc: string;
  icon: ReactElement;
  onClick: () => void;
  disabled?: boolean;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-left hover:border-brand-600 hover:bg-brand-50 disabled:opacity-50"
    >
      <div className="rounded-lg bg-subtle p-2 text-ink-2">{icon}</div>
      <div className="flex-1">
        <div className="pf-small font-semibold text-ink-1">Connect to {title}</div>
        <div className="pf-micro text-ink-3">{desc}</div>
      </div>
      <Plug size={16} className="text-brand-600" />
    </button>
  );
}

/* Step 2 — Objects */
function StepObjects({
  cfg,
  onNext,
  onBack,
}: {
  cfg: NonNullable<Integration>;
  onNext: () => void;
  onBack: () => void;
}): ReactElement {
  const patch = useApi.adminConfig.patchSalesforceIntegration();
  const [accounts, setAccounts] = useState(cfg.objects.accounts.enabled);
  const [accountsFilter, setAccountsFilter] = useState(cfg.objects.accounts.filter);
  const [contacts, setContacts] = useState(cfg.objects.contacts.enabled);
  const [opportunities, setOpportunities] = useState(cfg.objects.opportunities.enabled);
  const [oppFilter, setOppFilter] = useState(cfg.objects.opportunities.filter);

  const next = () => {
    patch.mutate(
      {
        objects: {
          accounts: { enabled: accounts, filter: accountsFilter },
          contacts: { enabled: contacts },
          opportunities: { enabled: opportunities, filter: oppFilter },
        },
      },
      { onSuccess: onNext },
    );
  };

  return (
    <div className="space-y-4">
      <div className="pf-card p-5 space-y-4">
        <div>
          <h2 className="mb-1">Choose what to sync</h2>
          <p className="pf-small text-ink-2">Pick the Salesforce objects to mirror, with optional filters.</p>
        </div>
        <ObjectRow
          icon={<Building2 size={18} />}
          title="Accounts → Partners"
          enabled={accounts}
          onToggle={setAccounts}
          filter={accountsFilter}
          onFilter={setAccountsFilter}
          filterPlaceholder="e.g. Type = 'Partner'"
        />
        <ObjectRow
          icon={<Workflow size={18} />}
          title="Contacts"
          enabled={contacts}
          onToggle={setContacts}
        />
        <ObjectRow
          icon={<Database size={18} />}
          title="Opportunities → Deals"
          enabled={opportunities}
          onToggle={setOpportunities}
          filter={oppFilter}
          onFilter={setOppFilter}
          filterPlaceholder="e.g. StageName != 'Closed Lost'"
        />
      </div>
      <StepNav onBack={onBack} onNext={next} nextDisabled={patch.isPending} />
    </div>
  );
}

function ObjectRow({
  icon,
  title,
  enabled,
  onToggle,
  filter,
  onFilter,
  filterPlaceholder,
}: {
  icon: ReactElement;
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  filter?: string;
  onFilter?: (v: string) => void;
  filterPlaceholder?: string;
}): ReactElement {
  return (
    <div className="rounded-lg border border-border p-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" className="h-4 w-4" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
        <span className="text-ink-3">{icon}</span>
        <span className="pf-small font-medium text-ink-1">{title}</span>
      </label>
      {enabled && onFilter && (
        <div className="mt-2 pl-10">
          <input
            value={filter ?? ''}
            onChange={(e) => onFilter(e.target.value)}
            placeholder={filterPlaceholder}
            className="w-full rounded-md border border-border bg-subtle px-2 py-1 font-mono text-[0.8125rem]"
          />
        </div>
      )}
    </div>
  );
}

/* Step 3 — Field mapping */
function StepFieldMap({
  cfg,
  onNext,
  onBack,
}: {
  cfg: NonNullable<Integration>;
  onNext: () => void;
  onBack: () => void;
}): ReactElement {
  const objects = (['account', 'contact', 'opportunity'] as SfObject[]).filter((o) =>
    o === 'account'
      ? cfg.objects.accounts.enabled
      : o === 'contact'
        ? cfg.objects.contacts.enabled
        : cfg.objects.opportunities.enabled,
  );
  const patch = useApi.adminConfig.patchSalesforceIntegration();
  // mapping state: object → pfField → sfField
  const [maps, setMaps] = useState<Record<SfObject, Record<string, string>>>({
    account: {},
    contact: {},
    opportunity: {},
  });

  const next = () => {
    const toEntries = (o: SfObject) =>
      Object.entries(maps[o])
        .filter(([, sf]) => sf)
        .map(([pfField, sfField]) => ({ sfField, pfField }));
    patch.mutate(
      {
        fieldMappings: {
          account: toEntries('account'),
          contact: toEntries('contact'),
          opportunity: toEntries('opportunity'),
        },
      },
      { onSuccess: onNext },
    );
  };

  return (
    <div className="space-y-4">
      <div className="pf-card p-5 space-y-5">
        <div>
          <h2 className="mb-1">Map fields</h2>
          <p className="pf-small text-ink-2">
            We've auto-matched fields by name. Adjust any row; required fields are marked.
          </p>
        </div>
        {objects.map((o) => (
          <ObjectMapper
            key={o}
            object={o}
            value={maps[o]}
            onChange={(m) => setMaps((s) => ({ ...s, [o]: m }))}
          />
        ))}
      </div>
      <StepNav onBack={onBack} onNext={next} nextDisabled={patch.isPending} />
    </div>
  );
}

function ObjectMapper({
  object,
  value,
  onChange,
}: {
  object: SfObject;
  value: Record<string, string>;
  onChange: (m: Record<string, string>) => void;
}): ReactElement {
  const describe = useApi.adminConfig.salesforceDescribe(object);
  const sfFields = describe.data?.fields ?? [];

  // Seed auto-suggestions once SF fields arrive (only if not already set).
  useEffect(() => {
    if (!sfFields.length || Object.keys(value).length) return;
    const seeded: Record<string, string> = {};
    for (const pf of PF_FIELDS[object]) seeded[pf] = suggestSfField(pf, sfFields);
    onChange(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [describe.data]);

  const label = object === 'account' ? 'Accounts' : object === 'contact' ? 'Contacts' : 'Opportunities';
  return (
    <div>
      <h3 className="pf-small font-semibold text-ink-1 mb-2">{label}</h3>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-subtle">
            <tr className="pf-micro text-ink-3">
              <th className="px-3 py-1.5 text-left">PartnerForge field</th>
              <th className="px-3 py-1.5 text-left">Salesforce field</th>
            </tr>
          </thead>
          <tbody>
            {PF_FIELDS[object].map((pf) => (
              <tr key={pf} className="border-t border-border">
                <td className="px-3 py-1.5 pf-small text-ink-1 font-mono">{pf}</td>
                <td className="px-3 py-1.5">
                  <select
                    value={value[pf] ?? ''}
                    onChange={(e) => onChange({ ...value, [pf]: e.target.value })}
                    className="w-full rounded-md border border-border bg-surface px-2 py-1 pf-small"
                  >
                    <option value="">— not mapped —</option>
                    {sfFields.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label} ({f.name})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Step 4 — Sync settings */
function StepSyncSettings({
  cfg,
  onNext,
  onBack,
}: {
  cfg: NonNullable<Integration>;
  onNext: () => void;
  onBack: () => void;
}): ReactElement {
  const patch = useApi.adminConfig.patchSalesforceIntegration();
  const [direction, setDirection] = useState(cfg.sync.direction);
  const [frequency, setFrequency] = useState(cfg.sync.frequency);
  const [conflictPolicy, setConflictPolicy] = useState(cfg.sync.conflictPolicy);

  const next = () =>
    patch.mutate({ sync: { direction, frequency, conflictPolicy } }, { onSuccess: onNext });

  return (
    <div className="space-y-4">
      <div className="pf-card p-5 space-y-4">
        <h2 className="mb-0">Sync settings</h2>
        <Field label="Direction">
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as typeof direction)}
            className="rounded-md border border-border bg-surface px-2 py-1 pf-small"
          >
            <option value="inbound">Inbound (Salesforce → PartnerForge)</option>
            <option value="bidirectional" disabled>
              Bidirectional (coming soon)
            </option>
          </select>
        </Field>
        <Field label="Frequency">
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as typeof frequency)}
            className="rounded-md border border-border bg-surface px-2 py-1 pf-small"
          >
            <option value="hourly">Hourly</option>
            <option value="every_4h">Every 4 hours</option>
            <option value="daily">Daily</option>
            <option value="manual">Manual only</option>
          </select>
        </Field>
        <Field label="Conflict policy">
          <select
            value={conflictPolicy}
            onChange={(e) => setConflictPolicy(e.target.value as typeof conflictPolicy)}
            className="rounded-md border border-border bg-surface px-2 py-1 pf-small"
          >
            <option value="sf_wins">Salesforce wins</option>
            <option value="pf_wins">PartnerForge wins</option>
            <option value="review">Send to review queue</option>
          </select>
        </Field>
      </div>
      <StepNav onBack={onBack} onNext={next} nextDisabled={patch.isPending} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactElement }): ReactElement {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="pf-small font-medium text-ink-1">{label}</span>
      {children}
    </label>
  );
}

/* Step 5 — Review + activate */
function StepReview({
  cfg,
  onBack,
}: {
  cfg: NonNullable<Integration>;
  onBack: () => void;
}): ReactElement {
  const toast = useToast();
  const navigate = useNavigate();
  const preview = useApi.adminConfig.salesforcePreview();
  const activate = useApi.adminConfig.activateSalesforceIntegration();

  const go = () =>
    activate.mutate(undefined, {
      onSuccess: () => {
        toast.show({ kind: 'success', title: 'Salesforce integration activated' });
        navigate('/sf/sync');
      },
      onError: (e: Error) => toast.show({ kind: 'error', title: 'Activation failed', body: e.message }),
    });

  return (
    <div className="space-y-4">
      <div className="pf-card p-5 space-y-3">
        <h2 className="mb-0">Review & activate</h2>
        <ul className="pf-small text-ink-2 space-y-1">
          <li>Org: <span className="text-ink-1 font-medium">{cfg.connection.orgName}</span> ({cfg.connection.environment})</li>
          <li>
            Objects: {[
              cfg.objects.accounts.enabled && 'Accounts',
              cfg.objects.contacts.enabled && 'Contacts',
              cfg.objects.opportunities.enabled && 'Opportunities',
            ].filter(Boolean).join(', ') || 'none'}
          </li>
          <li>Sync: {cfg.sync.frequency.replace('_', ' ')} · {cfg.sync.direction} · {cfg.sync.conflictPolicy.replace('_', ' ')}</li>
        </ul>
        <div className="rounded-lg bg-subtle p-3 pf-small text-ink-2">
          {preview.isLoading ? (
            'Calculating import preview…'
          ) : preview.data ? (
            <>
              This will import{' '}
              <span className="font-semibold text-ink-1">{preview.data.accounts} accounts</span>,{' '}
              <span className="font-semibold text-ink-1">{preview.data.opportunities} opportunities</span>, and{' '}
              <span className="font-semibold text-ink-1">{preview.data.contacts} contacts</span>.
            </>
          ) : (
            'Preview unavailable.'
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-border bg-surface px-4 py-2 pf-small font-medium text-ink-1 hover:bg-subtle"
        >
          Back
        </button>
        <button
          type="button"
          onClick={go}
          disabled={activate.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 pf-small font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          <CheckCircle2 size={16} /> {activate.isPending ? 'Activating…' : 'Activate integration'}
        </button>
      </div>
    </div>
  );
}
