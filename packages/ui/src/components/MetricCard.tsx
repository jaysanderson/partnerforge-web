/**
 * MetricCard — the KPI tile primitive.
 *
 * Reviewer-calibrated to Stripe Dashboard / Linear / Ramp standards:
 * Micro eyebrow label on top, .pf-display headline number with tabular
 * nums, optional delta chip rendered as bare coloured text (not a
 * tinted pill), sparkline aligned beside the number (not below) so
 * the tile reads short + dense.
 *
 * Renders "—" instead of "0" when the underlying raw value is exactly
 * zero AND no `value` override is supplied — avoids zeroes shouting.
 */
import type { ReactElement } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { CountUp } from './CountUp.js';
import { Sparkline } from './Sparkline.js';
import { Skeleton } from './Skeleton.js';

interface MetricCardProps {
  label: string;
  value: string;
  changePct?: number;
  progress?: number;
  trend?: number[];
  trendColor?: string;
  hint?: string;
  loading?: boolean;
  rawValue?: number;
  formatValue?: (n: number) => string;
  /** Top accent colour bar (3 px) — used for category tinting. */
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
  const showDash = rawValue === 0 && value === '0';
  return (
    <div className="pf-card-hover relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-6">
      {accent && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: accent }}
        />
      )}
      <div className="pf-micro">{label}</div>

      {loading ? (
        <div className="mt-3 space-y-2">
          <Skeleton variant="row" className="h-8 w-2/3" />
          {trend && <Skeleton variant="text" className="h-5 w-24" />}
        </div>
      ) : (
        <>
          {/* Number row: Display weight value + sparkline aligned right.
              This is the densification the reviewer wanted — sparkline
              beside the number, not below it. */}
          <div className="mt-2 flex items-end justify-between gap-3">
            <span
              className="pf-display text-ink-1"
              title={showDash ? 'No data in this range' : undefined}
            >
              {showDash ? (
                '—'
              ) : rawValue !== undefined && formatValue ? (
                <CountUp value={rawValue} format={formatValue} />
              ) : (
                value
              )}
            </span>
            {trend && trend.length > 0 && (
              <span
                className="shrink-0"
                style={trendColor ? { color: trendColor } : { color: 'var(--color-brand-500)' }}
              >
                <Sparkline data={trend} width={88} height={32} label={`${label} trend`} />
              </span>
            )}
          </div>

          {/* Delta + hint row — bare coloured text (no pill tint).
              Linear style. */}
          {(changePct !== undefined || hint) && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px]">
              {changePct !== undefined && (
                <span
                  className={`inline-flex items-center gap-0.5 font-medium ${
                    up ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(changePct).toFixed(1)}%
                </span>
              )}
              {hint && <span className="text-ink-3">{hint}</span>}
            </div>
          )}
        </>
      )}

      {progress !== undefined && !loading && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-subtle">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}
