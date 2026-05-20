/**
 * API & integrations — mint, list, revoke service-account API keys.
 *
 * Replaces the placeholder from PR7. The keys here are what MCP servers,
 * Make/Zapier flows, Power Automate, and customer-built integrations use
 * (X-Api-Key header). Plaintext is shown EXACTLY ONCE on mint — stored
 * as SHA-256 hash thereafter, so this UI is the only chance to copy it.
 */
import { useState, type ReactElement } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  Trash2,
} from 'lucide-react';
import { useApi, useApiUtils } from '../api/hooks';

// Common scopes a caller might want. Free-form text is supported too.
const SCOPE_PRESETS = [
  { label: 'Admin (everything)', value: 'admin:*' },
  { label: 'Read partners', value: 'partners:read' },
  { label: 'Read deals', value: 'deals:read' },
  { label: 'Write deals', value: 'deals:write' },
  { label: 'Read AI', value: 'ai:ask' },
  { label: 'Run sync', value: 'sync:run' },
  { label: 'Run intel', value: 'intel:run' },
  { label: 'Cache refresh', value: 'cache:refresh' },
  { label: 'Read reports', value: 'reports:read' },
];

function shortDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

export function ApiKeys(): ReactElement {
  const utils = useApiUtils();
  const keys = useApi.apiKeys.list();
  const create = useApi.apiKeys.create();
  const revoke = useApi.apiKeys.revoke();

  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>(['admin:*']);
  const [customScope, setCustomScope] = useState('');
  const [minted, setMinted] = useState<{ name: string; plaintext: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleScope = (value: string) => {
    setSelected((s) =>
      s.includes(value) ? s.filter((x) => x !== value) : [...s, value],
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const scopes = [...selected];
    if (customScope.trim()) {
      for (const s of customScope.split(/[\s,]+/).filter(Boolean)) {
        if (!scopes.includes(s)) scopes.push(s);
      }
    }
    create.mutate(
      { name: name.trim(), scopes: scopes.length ? scopes : ['admin:*'] },
      {
        onSuccess: (r) => {
          setMinted({ name: r.name, plaintext: r.plaintext });
          setName('');
          setSelected(['admin:*']);
          setCustomScope('');
          void utils.apiKeys.list.invalidate();
        },
      },
    );
  };

  const copyKey = async () => {
    if (!minted) return;
    await navigator.clipboard.writeText(minted.plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onRevoke = (id: string, name: string) => {
    if (!window.confirm(`Revoke key "${name}"? This is permanent.`)) return;
    revoke.mutate({ id }, { onSuccess: () => void utils.apiKeys.list.invalidate() });
  };

  const rows = keys.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure
        </div>
        <h1 className="font-heading text-h1 font-semibold">API &amp; integrations</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Service-account API keys for non-browser integrations — MCP servers,
          Make / Zapier / Power Automate flows, customer-built integrations.
          Sent as the <code className="rounded bg-background px-1.5 py-0.5 font-mono text-[12px]">X-Api-Key</code>{' '}
          header. The full key is shown <strong>exactly once</strong> on mint.
        </p>
        <a
          href="/docs"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-small text-progress-blue hover:underline"
        >
          Open the API documentation
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Just-minted plaintext */}
      {minted && (
        <div className="rounded-[var(--radius-card)] border-2 border-success/40 bg-success/5 p-5">
          <div className="mb-2 flex items-center gap-2 font-medium text-success">
            <KeyRound size={16} />
            New key &quot;{minted.name}&quot; minted
          </div>
          <p className="mb-3 text-small text-text-secondary">
            Copy this now — it will not be shown again. Only the SHA-256 hash
            is stored.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 select-all overflow-x-auto rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2 font-mono text-small">
              {minted.plaintext}
            </code>
            <button
              type="button"
              onClick={copyKey}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-progress-blue px-3 py-2 text-small font-medium text-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={() => setMinted(null)}
              className="rounded-[var(--radius-control)] border border-border px-3 py-2 text-small"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Mint form */}
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-3 font-heading text-h3 font-semibold">Mint a new key</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-small font-medium">
              Name
              <span className="ml-1 text-text-secondary">
                (human-readable; shows up in audit log)
              </span>
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "make-zapier-bridge" or "internal-bi-readonly"'
              maxLength={80}
              required
              className="w-full rounded-[var(--radius-control)] border border-border px-3 py-2 text-body outline-none focus:border-border-focus"
            />
          </label>

          <div>
            <span className="mb-1 block text-small font-medium">Scopes</span>
            <div className="flex flex-wrap gap-2">
              {SCOPE_PRESETS.map((s) => (
                <label
                  key={s.value}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption ${
                    selected.includes(s.value)
                      ? 'border-progress-blue bg-ai-surface text-ai-accent'
                      : 'border-border text-text-secondary'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected.includes(s.value)}
                    onChange={() => toggleScope(s.value)}
                  />
                  {s.label}
                  <code className="ml-1 font-mono text-[10px] opacity-70">{s.value}</code>
                </label>
              ))}
            </div>
            <input
              value={customScope}
              onChange={(e) => setCustomScope(e.target.value)}
              placeholder="Custom scopes (space- or comma-separated): e.g. portal:read content:write"
              className="mt-2 w-full rounded-[var(--radius-control)] border border-border bg-surface-alt px-3 py-1.5 font-mono text-caption outline-none focus:border-border-focus"
            />
          </div>

          <button
            type="submit"
            disabled={create.isPending || !name.trim()}
            className="rounded-[var(--radius-control)] bg-progress-red px-4 py-2 text-small font-medium text-white disabled:opacity-50"
          >
            {create.isPending ? 'Minting…' : 'Mint key'}
          </button>
          {create.error && (
            <p className="text-small text-danger">{(create.error as Error).message}</p>
          )}
        </form>
        <div className="mt-3 font-mono text-caption text-text-secondary">
          POST /v1/api-keys
        </div>
      </section>

      {/* Existing keys */}
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-h3 font-semibold">Existing keys</h2>
          <span className="text-caption text-text-secondary">
            {rows.length} {rows.length === 1 ? 'key' : 'keys'}
          </span>
        </div>
        {rows.length === 0 ? (
          <p className="text-small text-text-secondary">No API keys yet.</p>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Prefix</th>
                <th className="px-3 py-2">Scopes</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Last used</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((k) => {
                const revoked = !!k.revokedAt;
                return (
                  <tr key={k.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{k.name}</td>
                    <td className="px-3 py-2 font-mono text-small text-text-secondary">
                      {k.prefix}…
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {(k.scopes ?? []).map((s) => (
                          <code
                            key={s}
                            className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-[10px]"
                          >
                            {s}
                          </code>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-caption text-text-secondary">
                      {shortDate(k.createdAt)}
                    </td>
                    <td className="px-3 py-2 text-caption text-text-secondary">
                      {shortDate(k.lastUsedAt)}
                    </td>
                    <td className="px-3 py-2">
                      {revoked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-caption text-danger">
                          <AlertTriangle size={12} />
                          revoked
                        </span>
                      ) : (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-caption text-success">
                          active
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {!revoked && (
                        <button
                          type="button"
                          onClick={() => onRevoke(k.id, k.name)}
                          disabled={revoke.isPending}
                          aria-label={`Revoke ${k.name}`}
                          className="text-text-secondary hover:text-danger disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="mt-3 font-mono text-caption text-text-secondary">
          GET /v1/api-keys · POST /v1/api-keys/{`{id}`}/revoke
        </div>
      </section>
    </div>
  );
}
