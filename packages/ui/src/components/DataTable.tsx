import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Download, Search } from 'lucide-react';

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

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  density?: 'compact' | 'comfortable';
  exportFilename?: string;
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

/**
 * Enterprise data table — sortable, filterable, CSV-exportable. Tables are
 * first-class citizens here; this is the default view for operational data.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  density = 'compact',
  exportFilename = 'export.csv',
}: DataTableProps<T>): ReactElement {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      columns.some((c) => String(c.accessor(r)).toLowerCase().includes(q)),
    );
  }, [rows, columns, query]);

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
    const blob = new Blob([toCsv(columns, sorted)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
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
        <button
          type="button"
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small font-medium text-text-primary hover:bg-surface-alt"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body">
          <thead>
            <tr className="text-left">
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
            {sorted.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={() => onRowClick?.(row)}
                className={`${rowH} border-b border-border/70 transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-info/[0.04]' : ''
                }`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-4 ${c.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {c.render ? c.render(row) : c.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-small text-text-secondary"
                >
                  No records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
