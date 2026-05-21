import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Download } from 'lucide-react';
import {
  DataTable,
  StatusBadge,
  useToast,
  type BulkAction,
  type Column,
  type Facet,
} from '@partnerforge/ui';
import { useApi, useApiUtils } from '../api/hooks';
import type { DealRow as Row } from '../api-types';
import { money, shortDate, daysSince } from '../lib/format';
import { ScopeBar } from '../components/ScopeBar';
import { scopeParams, useScope } from '../scope';

const STAGES = ['Registered', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'] as const;

function ageBadge(days: number): string {
  if (days < 14) return 'bg-success/10 text-success';
  if (days < 30) return 'bg-warning/10 text-warning';
  return 'bg-danger/10 text-danger';
}

export function Deals() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const utils = useApiUtils();
  const toast = useToast();
  const scope = useScope();
  const deals = useApi.deals.list(scopeParams(scope));
  const conflicts = useApi.deals.conflicts();
  const update = useApi.deals.update();

  const facets: Facet<Row>[] = [
    { key: 'stage', label: 'Stage', accessor: (r) => r.stage, values: [...STAGES] },
    { key: 'status', label: 'Status', accessor: (r) => r.status },
    { key: 'region', label: 'Region', accessor: (r) => r.region },
    { key: 'product', label: 'Product', accessor: (r) => r.product },
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
          body: `${rows.length} deal${rows.length === 1 ? '' : 's'} included in the CSV.`,
        });
      },
    },
    {
      key: 'advance',
      label: 'Advance stage',
      icon: ({ size }) => <ArrowRight size={size} />,
      tone: 'primary',
      onRun: (rows) => {
        // Optimistic UI — fire one update mutation per row, then a single
        // invalidate at the end. Show a toast on success.
        const advance: Record<string, string> = {
          Registered: 'Qualified',
          Qualified: 'Proposal',
          Proposal: 'Negotiation',
          Negotiation: 'Closed Won',
        };
        const advanceable = rows.filter((r) => advance[r.stage]);
        if (advanceable.length === 0) {
          toast.show({
            kind: 'warning',
            title: 'Nothing to advance',
            body: 'Selected deals are already at the final stage.',
          });
          return;
        }
        const total = advanceable.length;
        let done = 0;
        for (const r of advanceable) {
          update.mutate(
            { id: r.id, stage: advance[r.stage]! },
            {
              onSettled: () => {
                done++;
                if (done === total) {
                  utils.deals.list.invalidate();
                  toast.show({
                    kind: 'success',
                    title: `Advanced ${total} deal${total === 1 ? '' : 's'}`,
                    body: 'Salesforce will receive the update on next sync.',
                  });
                }
              },
            },
          );
        }
      },
    },
  ];

  // useApi mutations don't accept onSuccess in the hook factory (kept hooks
  // small); invalidate explicitly after mutate.
  const moveDeal = (id: string, stage: string) =>
    update.mutate({ id, stage }, { onSuccess: () => utils.deals.list.invalidate() });

  const conflictIds = useMemo(() => {
    const s = new Set<string>();
    for (const c of conflicts.data ?? []) {
      s.add(c.dealId);
      s.add(c.conflictingDealId);
    }
    return s;
  }, [conflicts.data]);

  const ds = deals.data ?? [];

  const move = (deal: Row, stage: string) => {
    if (deal.stage === stage) return;
    if (!window.confirm(`Move "${deal.companyName}" to ${stage}?`)) return;
    moveDeal(deal.id, stage);
  };

  const columns: Column<Row>[] = [
    {
      key: 'company',
      header: 'Company',
      accessor: (r) => r.companyName,
      render: (r) => (
        <span className="flex items-center gap-1.5">
          {conflictIds.has(r.id) && <AlertTriangle size={14} className="text-danger" />}
          {r.companyName}
        </span>
      ),
    },
    { key: 'value', header: 'Value', align: 'right', accessor: (r) => r.value, render: (r) => <span className="font-mono">{money(r.value, r.currency)}</span> },
    { key: 'stage', header: 'Stage', accessor: (r) => r.stage, render: (r) => <StatusBadge status={r.stage} /> },
    { key: 'product', header: 'Product', accessor: (r) => r.product ?? '—' },
    { key: 'health', header: 'Health', align: 'right', accessor: (r) => r.healthScore ?? 0 },
    { key: 'updated', header: 'Updated', accessor: (r) => shortDate(r.updatedAt) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 >Deals</h1>
        <div className="flex rounded-[var(--radius-control)] border border-border">
          {(['kanban', 'table'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-small capitalize ${
                view === v ? 'bg-progress-dark text-white' : 'text-text-secondary'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <ScopeBar />

      {view === 'table' ? (
        <DataTable
          columns={columns}
          rows={ds}
          getRowId={(r) => r.id}
          exportFilename="deals.csv"
          facets={facets}
          bulkActions={bulkActions}
          emptyState={{
            title: 'No deals yet',
            body: 'Deals registered by partners appear here. Use Salesforce sync or the API to import existing pipeline.',
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {STAGES.map((stage) => {
            const col = ds.filter((d) => d.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData('text/plain');
                  const deal = ds.find((d) => d.id === id);
                  if (deal) move(deal, stage);
                }}
                className="rounded-[var(--radius-card)] bg-surface-alt p-2"
              >
                <div className="mb-2 flex items-center justify-between px-1 text-caption font-semibold uppercase text-text-secondary">
                  <span>{stage}</span>
                  <span>{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((d) => {
                    const age = daysSince(d.updatedAt);
                    return (
                      <div
                        key={d.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', d.id)}
                        className="cursor-grab rounded-[var(--radius-control)] border border-border bg-surface p-3 shadow-[var(--shadow-card)]"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-small font-medium">{d.companyName}</span>
                          {conflictIds.has(d.id) && (
                            <AlertTriangle size={14} className="text-danger" />
                          )}
                        </div>
                        <div className="mt-1 font-mono text-small text-text-secondary">
                          {money(d.value, d.currency)}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-caption text-text-secondary">
                            {d.product ?? '—'}
                          </span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-caption ${ageBadge(age)}`}
                          >
                            {age}d
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
