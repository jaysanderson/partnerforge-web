import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { DataTable, StatusBadge, type Column } from '@partnerforge/ui';
import { useApi, useApiUtils } from '../api/hooks';
import type { ContentRow as Row } from '../api-types';
import { shortDate } from '../lib/format';

export function Content() {
  const utils = useApiUtils();
  const content = useApi.content.list();
  const publish = useApi.content.publish();
  const [q, setQ] = useState('');
  const search = useApi.ai.search({
    query: q.length > 2 ? q : '',
    scope: 'enablement',
    limit: 25,
  });

  let rows = content.data ?? [];
  if (q.length > 2 && search.data?.ok) {
    const ids = new Set(
      search.data.hits.map((h) => h.slug?.replace(/^content-/, '')).filter(Boolean) as string[],
    );
    rows = rows.filter((r) => ids.has(r.id));
  }

  const columns: Column<Row>[] = [
    { key: 'title', header: 'Title', accessor: (r) => r.title },
    { key: 'type', header: 'Type', accessor: (r) => r.type },
    {
      key: 'tier',
      header: 'Tier access',
      accessor: (r) => (r.tierAccess ?? []).join(', ') || 'all',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
    { key: 'updated', header: 'Updated', accessor: (r) => shortDate(r.updatedAt) },
    {
      key: 'action',
      header: '',
      accessor: () => '',
      render: (r) => (
        <button
          type="button"
          onClick={() =>
            publish.mutate(
              { id: r.id, publish: r.status !== 'published' },
              { onSuccess: () => utils.content.list.invalidate() },
            )
          }
          className="rounded-[var(--radius-control)] border border-border px-2 py-1 text-caption hover:bg-surface-alt"
        >
          {r.status === 'published' ? 'Unpublish' : 'Publish'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 >Content</h1>
        <div className="relative">
          <Sparkles
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ai-accent"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Semantic search (ARAG /find)…"
            className="w-96 rounded-[var(--radius-control)] border border-border bg-surface py-2 pl-8 pr-3 text-small outline-none focus:border-border-focus"
          />
        </div>
      </div>
      <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} exportFilename="content.csv" />
    </div>
  );
}
