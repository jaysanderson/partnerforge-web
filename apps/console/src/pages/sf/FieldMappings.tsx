/**
 * Salesforce → Field mappings (read-only mirror).
 *
 * Shows the Salesforce-field → PartnerForge-field mappings configured in the
 * Connection wizard's "Map fields" step. Editing happens in the wizard
 * (Connection page); this is the at-a-glance reference.
 */
import type { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../../api/hooks';

const SECTIONS: { key: 'account' | 'contact' | 'opportunity'; label: string }[] = [
  { key: 'account', label: 'Accounts → Partners' },
  { key: 'contact', label: 'Contacts' },
  { key: 'opportunity', label: 'Opportunities → Deals' },
];

export function SfFieldMappings(): ReactElement {
  const q = useApi.adminConfig.salesforceIntegration();
  const maps = q.data?.fieldMappings;

  return (
    <div className="space-y-6">
      <div>
        <p className="pf-micro text-ink-3">CONFIGURE / SALESFORCE</p>
        <h1>Field mappings</h1>
        <p className="pf-small text-ink-2">
          How Salesforce fields map onto PartnerForge. Set these in the{' '}
          <Link to="/sf/connection" className="text-brand-600 underline">
            Connection wizard
          </Link>
          .
        </p>
      </div>

      {!maps || SECTIONS.every((s) => (maps[s.key] ?? []).length === 0) ? (
        <div className="pf-card p-5">
          <p className="pf-small text-ink-2">
            No field mappings yet. Connect Salesforce and complete the “Map fields” step to
            populate this.
          </p>
        </div>
      ) : (
        SECTIONS.map((s) => {
          const rows = maps[s.key] ?? [];
          if (!rows.length) return null;
          return (
            <div key={s.key} className="pf-card p-5">
              <h2 className="mb-3">{s.label}</h2>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-subtle">
                    <tr className="pf-micro text-ink-3">
                      <th className="px-3 py-1.5 text-left">Salesforce field</th>
                      <th className="px-3 py-1.5 text-left" />
                      <th className="px-3 py-1.5 text-left">PartnerForge field</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((m) => (
                      <tr key={`${m.sfField}-${m.pfField}`} className="border-t border-border">
                        <td className="px-3 py-1.5 pf-small font-mono text-ink-1">{m.sfField}</td>
                        <td className="px-3 py-1.5 text-ink-3">
                          <ArrowRight size={14} />
                        </td>
                        <td className="px-3 py-1.5 pf-small font-mono text-ink-1">{m.pfField}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
