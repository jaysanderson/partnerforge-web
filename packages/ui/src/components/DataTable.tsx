/**
 * DataTable — enterprise table with sort, filter, faceted filters,
 * CSV export, bulk-select, sticky action bar, and a real empty state.
 *
 * Extended from the PR_UX1 base in PR_UX_B. The original API is
 * backward-compatible: existing callers that pass only `columns`,
 * `rows`, `getRowId` still work as before. New opt-in props:
 *
 *   - `facets` — chip-style filter rows configurable per page
 *   - `bulkActions` — sticky bottom action bar appears once any row
 *     is selected; receives the selected row objects
 *   - `emptyState` — override the default "no records" copy via the
 *     shared <EmptyState /> primitive
 *
 * Headless table libraries (TanStack) would buy us multi-sort and
 * column-vis cheaply, but for the screenshot-visible delta this
 * straight-React extension is enough.
 */
import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Download, Search, X } from 'lucide-react';
import { EmptyState } from './EmptyState.js';

export interface Column<T> {
  key: string;
  header: string;
  /** Primitive value used for sorting, filtering, and CSV export. */
  accessor: (row: T) => string | number;
  /** Optional custom cell. Falls back to the accessor value. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right';
}

/** Configuration for one faceted-filter chip group above the table. */
export interface Facet<T> {
  key: string;
  label: string;
  /** Pull the value to filter on. Usually a tier / status / region accessor. */
  accessor: (row: T) => string | null | undefined;
  /**
   * Optional explicit value list. When omitted, derived from the rows.
   * Order is preserved so callers can put "All" / "Active" first.
   */
  values?: string[];
}

export interface BulkAction<T> {
  key: string;
  label: string;
  /** Lucide icon component or any React element renderer. */
  icon?: (props: { size?: number }) => ReactNode;
  /** Style override — 'danger' renders destructively (red text). */
  tone?: 'default' | 'primary' | 'danger';
  /** Called with the currently-selected rows. */
  onRun: (rows: T[]) => void | Promise<void>;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  density?: 'compact' | 'comfortable';
  exportFilename?: string;
  /** Faceted filters above the table. */
  facets?: Facet<T>[];
  /** Bulk actions — when present, a checkbox column appears. */
  bulkActions?: BulkAction<T>[];
  /** Custom empty state when there are no rows at all. */
  emptyState?: { title: string; body?: ReactNode; action?: { label: string; onClick: () => void } };
}

type SortDir = 'asc' | 'desc';

function toCsv<T>(columns: Column<T>[], rows: T[]): string {
  const esc = (v: string | number): string => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = columns.map((c) => esc(c.header)).join(',');
  const body = rows.map((r) => columns.map((c) => esc(c.accessor(r))).join(',')).join('\n');
  return `${head}\n${body}`;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  density = 'compact',
  exportFilename = 'export.csv',
  facets = [],
  bulkActions,
  emptyState,
}: DataTableProps<T>): ReactElement {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [query, setQuery] = useState('');
  // Faceted-filter selections: facetKey → Set of selected values.
  const [facetSel, setFacetSel] = useState<Record<string, Set<string>>>({});
  // Bulk-select: row ids currently checked.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Apply free-text + faceted filters.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !columns.some((c) => String(c.accessor(r)).toLowerCase().includes(q))) return false;
      for (const facet of facets) {
        const sel = facetSel[facet.key];
        if (!sel || sel.size === 0) continue;
        const v = facet.accessor(r);
        if (v == null || !sel.has(String(v))) return false;
      }
      return true;
    });
  }, [rows, columns, query, facets, facetSel]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = col.accessor(a);
      const bv = col.accessor(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [filtered, columns, sortKey, sortDir]);

  // Compute facet value lists from the unfiltered rows so toggling a value
  // doesn't make other values disappear.
  const facetValueLists = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const facet of facets) {
      if (facet.values) {
        out[facet.key] = facet.values;
        continue;
      }
      const set = new Set<string>();
      for (const r of rows) {
        const v = facet.accessor(r);
        if (v != null && String(v) !== '') set.add(String(v));
      }
      out[facet.key] = Array.from(set).sort();
    }
    return out;
  }, [facets, rows]);

  const rowH = density === 'compact' ? 'h-11' : 'h-14';

  const handleSort = (col: Column<T>): void => {
    if (col.sortable === false) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const exportCsv = (): void => {
    const data = selected.size > 0 ? sorted.filter((r) => selected.has(getRowId(r))) : sorted;
    const blob = new Blob([toCsv(columns, data)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFacet = (facetKey: string, value: string) => {
    setFacetSel((prev) => {
      const next = { ...prev };
      const cur = new Set(next[facetKey] ?? []);
      if (cur.has(value)) cur.delete(value);
      else cur.add(value);
      next[facetKey] = cur;
      return next;
    });
  };

  const clearFacets = () => {
    setFacetSel({});
    setQuery('');
  };

  const activeFacetCount = Object.values(facetSel).reduce((s, set) => s + set.size, 0);
  const hasAnyFilter = activeFacetCount > 0 || query.trim().length > 0;

  const allSelectedOnPage = sorted.length > 0 && sorted.every((r) => selected.has(getRowId(r)));
  const someSelectedOnPage = sorted.some((r) => selected.has(getRowId(r))) && !allSelectedOnPage;

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        for (const r of sorted) next.delete(getRowId(r));
      } else {
        for (const r of sorted) next.add(getRowId(r));
      }
      return next;
    });
  };

  const selectedRows = useMemo(
    () => sorted.filter((r) => selected.has(getRowId(r))),
    [sorted, selected, getRowId],
  );

  const showBulk = !!bulkActions && bulkActions.length > 0;
  const colCount = columns.length + (showBulk ? 1 : 0);

  return (
    <div className="relative rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter…"
              className="w-64 rounded-[var(--radius-control)] border border-border bg-surface py-1.5 pl-8 pr-3 text-small outline-none focus:border-border-focus"
            />
          </div>
          <span className="text-caption text-text-secondary">
            {sorted.length} {sorted.length === 1 ? 'row' : 'rows'}
            {hasAnyFilter && rows.length !== sorted.length && (
              <span> of {rows.length}</span>
            )}
          </span>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearFacets}
              className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-caption text-text-secondary hover:text-text-primary"
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small font-medium text-text-primary hover:bg-surface-alt"
        >
          <Download size={14} />
          Export CSV{selected.size > 0 ? ` (${selected.size})` : ''}
        </button>
      </div>

      {/* Faceted filter chips */}
      {facets.length > 0 && (
        <div className="space-y-1.5 border-b border-border px-4 py-2.5">
          {facets.map((facet) => {
            const sel = facetSel[facet.key] ?? new Set<string>();
            const values = facetValueLists[facet.key] ?? [];
            if (values.length === 0) return null;
            return (
              <div key={facet.key} className="flex flex-wrap items-center gap-1.5">
                <span className="w-20 shrink-0 text-caption font-semibold uppercase tracking-wide text-text-secondary">
                  {facet.label}
                </span>
                {values.map((v) => {
                  const on = sel.has(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleFacet(facet.key, v)}
                      className={`rounded-full border px-2.5 py-0.5 text-caption transition-colors ${
                        on
                          ? 'border-progress-blue bg-progress-blue/10 text-progress-blue'
                          : 'border-border text-text-secondary hover:border-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body">
          <thead>
            <tr className="text-left">
              {showBulk && (
                <th className="sticky top-0 z-10 w-9 select-none border-b border-border bg-surface-alt px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allSelectedOnPage}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelectedOnPage;
                    }}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 cursor-pointer accent-progress-blue"
                  />
                </th>
              )}
              {columns.map((c) => {
                const active = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c)}
                    className={`sticky top-0 z-10 select-none border-b border-border bg-surface-alt px-4 py-2.5 text-caption font-semibold uppercase tracking-wide text-text-secondary ${
                      c.align === 'right' ? 'text-right' : 'text-left'
                    } ${c.sortable === false ? '' : 'cursor-pointer hover:text-text-primary'}`}
                  >
                    <span
                      className={`inline-flex items-center gap-1 ${
                        c.align === 'right' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {c.header}
                      {active &&
                        (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  className={`${rowH} pf-row-hover border-b border-border/70 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${isSelected ? 'bg-progress-blue/[0.04]' : ''}`}
                >
                  {showBulk && (
                    <td className="px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={isSelected}
                        onChange={() =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (next.has(id)) next.delete(id);
                            else next.add(id);
                            return next;
                          })
                        }
                        className="h-3.5 w-3.5 cursor-pointer accent-progress-blue"
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      onClick={() => onRowClick?.(row)}
                      className={`px-4 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      {c.render ? c.render(row) : c.accessor(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-2">
                  <EmptyState
                    variant={hasAnyFilter ? 'zero-results' : 'zero-data'}
                    title={
                      hasAnyFilter
                        ? 'No rows match these filters'
                        : (emptyState?.title ?? 'No records yet')
                    }
                    body={hasAnyFilter ? undefined : emptyState?.body}
                    action={
                      hasAnyFilter
                        ? { label: 'Clear filters', onClick: clearFacets }
                        : emptyState?.action
                    }
                    compact
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sticky bulk-action bar */}
      {showBulk && selected.size > 0 && (
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center gap-3 border-t border-border bg-surface/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
          <span className="text-small font-medium">
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="rounded-full border border-border px-2.5 py-0.5 text-caption text-text-secondary hover:text-text-primary"
          >
            Clear
          </button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {bulkActions?.map((action) => {
              const cls =
                action.tone === 'danger'
                  ? 'border border-danger/40 text-danger hover:bg-danger/5'
                  : action.tone === 'primary'
                    ? 'bg-progress-blue text-white hover:bg-progress-blue/90'
                    : 'border border-border text-text-primary hover:bg-surface-alt';
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => {
                    void action.onRun(selectedRows);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-control)] px-3 py-1.5 text-small font-medium ${cls}`}
                >
                  {action.icon ? action.icon({ size: 14 }) : null}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
