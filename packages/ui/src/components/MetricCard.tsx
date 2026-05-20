import type { ReactElement } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { CountUp } from './CountUp.js';
import { Sparkline } from './Sparkline.js';
import { Skeleton } from './Skeleton.js';

interface MetricCardProps {
  label: string;
  value: string;
  /** Signed percentage vs prior period, e.g. +12.4 or -3.1. */
  changePct?: number;
  /** Optional progress toward a target, 0–1. */
  progress?: number;
  /**
   * Optional sparkline series — chronological. Renders a small inline trend
   * line in the bottom-right of the tile. Pass `[]` to render the empty
   * baseline (keeps card heights consistent in a row).
   */
  trend?: number[];
  /** Trend stroke colour. Defaults to muted secondary text. */
  trendColor?: string;
  /** Optional unobtrusive caption beneath the value (e.g. "vs last 30 d"). */
  hint?: string;
  /** Render a skeleton placeholder instead of the value/trend. */
  loading?: boolean;
  /**
   * Optional raw numeric value used to animate the headline number on
   * mount via <CountUp>. If omitted, `value` is shown statically (because
   * we can't parse arbitrary formatted strings safely).
   */
  rawValue?: number;
  /** Format the animating intermediate raw value back to a string. */
  formatValue?: (n: number) => string;
  /** Optional top accent colour bar (4px) — for tier or category tinting. */
  accent?: string;
}

export function MetricCard({
  label,
  value,
  changePct,
  progress,
  trend,
  trendColor,
  hint,
  loading,
  rawValue,
  formatValue,
  accent,
}: MetricCardProps): ReactElement {
  const up = (changePct ?? 0) >= 0;
  return (
    <div className="pf-card-hover relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      {accent && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: accent }}
        />
      )}
      <div className="text-caption font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </div>
      {loading ? (
        <div className="mt-3 space-y-2">
          <Skeleton variant="row" className="h-7 w-2/3" />
          {trend && <Skeleton variant="text" className="h-6 w-24" />}
        </div>
      ) : (
        <>
          <div className="mt-2.5 flex items-end justify-between gap-3">
            <span className="font-mono text-[1.875rem] font-semibold leading-none tracking-tight text-text-primary">
              {rawValue !== undefined && formatValue ? (
                <CountUp value={rawValue} format={formatValue} />
              ) : (
                value
              )}
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
          {trend && (
            <div className="mt-3 flex items-center justify-between gap-2">
              {hint ? (
                <span className="text-caption text-text-secondary">{hint}</span>
              ) : (
                <span />
              )}
              <span
                className={trendColor ? '' : 'text-progress-blue'}
                style={trendColor ? { color: trendColor } : undefined}
              >
                <Sparkline data={trend} width={88} height={26} label={`${label} trend`} />
              </span>
            </div>
          )}
          {hint && !trend && (
            <div className="mt-2 text-caption text-text-secondary">{hint}</div>
          )}
        </>
      )}
      {progress !== undefined && !loading && (
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
