/**
 * Salesforce → Field mappings (read-only view).
 *
 * Surfaces the opportunity field overrides set in Portal settings, so
 * staff can see at a glance which SF fields are exposed to partners and
 * under what labels. Editing happens in Portal settings (AdminConfig).
 */
import type { ReactElement } from 'react';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../../api/hooks';

export function SfFieldMappings(): ReactElement {
  const overrides = useApi.adminConfig.oppFieldOverrides();
  const rows = overrides.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Configure → Salesforce
        </div>
        <h1 className="font-heading text-h1 font-semibold">Field mappings</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          Per-field overrides that change which Salesforce Opportunity fields
          partners see in the portal, and under what label. Edits happen in{' '}
          <Link to="/portal-settings" className="text-progress-blue hover:underline">
            Portal settings
          </Link>{' '}
          — this page is the read-only summary.
        </p>
      </div>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
        {rows.length === 0 ? (
          <p className="text-small text-text-secondary">
            No overrides configured — partners see the default field labels +
            visibility from Salesforce metadata.
          </p>
        ) : (
          <table className="w-full text-body">
            <thead>
              <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                <th className="px-3 py-2">SF API name</th>
                <th className="px-3 py-2">Partner label override</th>
                <th className="px-3 py-2">Visible</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.apiName} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-small">{r.apiName}</td>
                  <td className="px-3 py-2">{r.partnerLabel ?? '—'}</td>
                  <td className="px-3 py-2">
                    {r.visibleToPartner === false ? (
                      <span className="inline-flex items-center gap-1 text-danger">
                        <EyeOff size={14} /> hidden
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-success">
                        <Eye size={14} /> visible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-3 flex items-center justify-between">
          <Link
            to="/portal-settings"
            className="inline-flex items-center gap-1 text-small text-progress-blue hover:underline"
          >
            Edit in Portal settings <ExternalLink size={12} />
          </Link>
          <div className="font-mono text-caption text-text-secondary">
            GET /v1/admin-config/opp-field-overrides
          </div>
        </div>
      </section>
    </div>
  );
}
