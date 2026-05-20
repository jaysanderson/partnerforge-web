/**
 * Placeholder page used during the menu reorg (PR7) for sections whose UIs
 * aren't built yet. Shows the page name, a short description, and the API
 * endpoints the eventual UI will consume — so the demo story is still
 * "every screen is just a call to the API" even when the screen is a stub.
 */
import type { ComponentType, ReactElement } from 'react';
import { Construction, ExternalLink } from 'lucide-react';

interface PlaceholderProps {
  /** Page title shown at top. */
  title: string;
  /** Section it belongs under (Programs, Configure, …). */
  group?: string;
  /** One-sentence purpose. */
  summary: string;
  /** REST / tRPC paths this page will exercise once built. */
  endpoints?: string[];
  /** Optional icon for the hero block. */
  icon?: ComponentType<{ size?: number | string }>;
}

export function Placeholder({
  title,
  group,
  summary,
  endpoints = [],
  icon: Icon = Construction,
}: PlaceholderProps): ReactElement {
  return (
    <div className="space-y-6">
      <div>
        {group && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            {group}
          </div>
        )}
        <h1 className="font-heading text-h1 font-semibold">{title}</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">{summary}</p>
      </div>

      <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-6">
        <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-card)] bg-warning/10 text-warning">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-h3 font-semibold">Coming soon</h2>
          <p className="mt-1 text-small text-text-secondary">
            This screen is part of the next implementation pass. The backend endpoints
            below are live — you can integrate against them today from your own UI or
            via the OpenAPI documentation at <code>/docs</code>.
          </p>
          {endpoints.length > 0 && (
            <div className="mt-4 space-y-1">
              <div className="text-caption font-semibold uppercase tracking-wide text-text-secondary">
                API surface
              </div>
              <ul className="space-y-1">
                {endpoints.map((ep) => (
                  <li key={ep} className="flex items-center gap-2 text-small">
                    <code className="rounded bg-background px-2 py-0.5 font-mono text-[12px]">
                      {ep}
                    </code>
                  </li>
                ))}
              </ul>
              <a
                href="/docs"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-small text-progress-blue hover:underline"
              >
                Open API docs <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
