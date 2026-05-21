import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Sparkles } from 'lucide-react';
import {
  DataTable,
  StatusBadge,
  TierBadge,
  useToast,
  type BulkAction,
  type Column,
  type Facet,
} from '@partnerforge/ui';
import type { PartnerTier } from '@partnerforge/shared';
import { useApi } from '../api/hooks';
import type { PartnerRow as Row } from '../api-types';
import { money, shortDate } from '../lib/format';
import { ScopeBar } from '../components/ScopeBar';
import { scopeParams, useScope } from '../scope';

export function Partners() {
  const navigate = useNavigate();
  const scope = useScope();
  const partners = useApi.partners.list(scopeParams(scope));
  const deals = useApi.deals.list(scopeParams(scope));
  const { facets, bulkActions } = useFacetsAndBulk();
  const [semantic, setSemantic] = useState('');
  // Gate semantic search behind a 2-char threshold (was: trpc useQuery enabled flag).
  const search = useApi.ai.search({
    query: semantic.length > 2 ? semantic : '',
    scope: 'partner',
    limit: 25,
  });

  const pipelineByPartner = (id: string) =>
    (deals.data ?? [])
      .filter((d) => d.partnerId === id && d.status === 'open')
      .reduce((s, d) => s + d.value, 0);
  const activeDeals = (id: string) =>
    (deals.data ?? []).filter((d) => d.partnerId === id && d.status === 'open').length;

  let rows = partners.data ?? [];
  if (semantic.length > 2 && search.data?.ok) {
    const ids = new Set(
      search.data.hits
        .map((h) => h.slug?.replace(/^partner-/, ''))
        .filter((x): x is string => Boolean(x)),
    );
    rows = rows.filter((r) => ids.has(r.id));
  }

  const columns: Column<Row>[] = [
    { key: 'name', header: 'Partner', accessor: (r) => r.name },
    {
      key: 'tier',
      header: 'Tier',
      accessor: (r) => r.tier,
      render: (r) => <TierBadge tier={r.tier as PartnerTier} />,
    },
    { key: 'type', header: 'Type', accessor: (r) => r.type },
    { key: 'region', header: 'Region', accessor: (r) => r.region },
    {
      key: 'pipeline',
      header: 'Pipeline',
      align: 'right',
      accessor: (r) => pipelineByPartner(r.id),
      render: (r) => <span className="font-mono">{money(pipelineByPartner(r.id))}</span>,
    },
    { key: 'deals', header: 'Active', align: 'right', accessor: (r) => activeDeals(r.id) },
    { key: 'eng', header: 'Engagement', align: 'right', accessor: (r) => r.engagementScore },
    { key: 'last', header: 'Updated', accessor: (r) => shortDate(r.updatedAt) },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 >Partners</h1>
        <div className="relative">
          <Sparkles
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ai-accent"
          />
          <input
            value={semantic}
            onChange={(e) => setSemantic(e.target.value)}
            placeholder="Semantic search (ARAG)…  e.g. cybersecurity partner in EMEA"
            className="w-96 rounded-[var(--radius-control)] border border-border bg-surface py-2 pl-8 pr-3 text-small outline-none focus:border-border-focus"
          />
        </div>
      </div>
      <ScopeBar />
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(`/partners/${r.id}`)}
        exportFilename="partners.csv"
        facets={facets}
        bulkActions={bulkActions}
        emptyState={{
          title: 'No partners yet',
          body: 'Invite partners by syncing from Salesforce or registering manually via the API.',
        }}
      />
    </div>
  );
}

// ── facets + bulk actions are defined at module scope so they're stable
// across renders (otherwise DataTable's faceted-filter memo thrashes). ──

function useFacetsAndBulk(): { facets: Facet<Row>[]; bulkActions: BulkAction<Row>[] } {
  const toast = useToast();
  const facets: Facet<Row>[] = [
    { key: 'tier', label: 'Tier', accessor: (r) => r.tier },
    { key: 'type', label: 'Type', accessor: (r) => r.type },
    { key: 'region', label: 'Region', accessor: (r) => r.region },
    { key: 'status', label: 'Status', accessor: (r) => r.status },
  ];
  const bulkActions: BulkAction<Row>[] = [
    {
      key: 'export',
      label: 'Export selected',
      icon: ({ size }) => <Download size={size} />,
      onRun: (rows) => {
        toast.show({
          kind: 'success',
          title: 'Export prepared',
          body: `${rows.length} partner${rows.length === 1 ? '' : 's'} included in the CSV.`,
        });
      },
    },
  ];
  return { facets, bulkActions };
}
