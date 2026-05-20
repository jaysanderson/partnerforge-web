import type { ReactElement } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  /** Signed percentage vs prior period, e.g. +12.4 or -3.1. */
  changePct?: number;
  /** Optional progress toward a target, 0–1. */
  progress?: number;
}

export function MetricCard({ label, value, changePct, progress }: MetricCardProps): ReactElement {
  const up = (changePct ?? 0) >= 0;
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div className="text-caption font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </div>
      <div className="mt-2.5 flex items-end justify-between gap-3">
        <span className="font-mono text-[1.75rem] font-semibold leading-none text-text-primary">
          {value}
        </span>
        {changePct !== undefined && (
          <span
            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-caption font-semibold ${
              up ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(changePct).toFixed(1)}%
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
          <div
            className="h-full rounded-full bg-progress-green transition-[width] duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}
