/**
 * Skeleton — shimmer placeholder rendered while async data is loading.
 *
 * Three variants, all built from the same primitive so the visual
 * vocabulary stays consistent:
 *   - `text` — a single line, useful inline (table cells, list rows)
 *   - `row` — a chunkier bar, useful for narrow list rows
 *   - `card` — a full block matching the height of a KPI tile
 *
 * The shimmer animation respects `prefers-reduced-motion: reduce`
 * automatically via the CSS class.
 */
import type { ReactElement } from 'react';

type Variant = 'text' | 'row' | 'card';

interface SkeletonProps {
  variant?: Variant;
  /** Override the default height (in tailwind h-* class form). */
  className?: string;
  /** Render N skeletons stacked vertically. Default 1. */
  count?: number;
}

const SIZE: Record<Variant, string> = {
  text: 'h-3.5 w-full',
  row: 'h-5 w-full',
  card: 'h-24 w-full',
};

export function Skeleton({ variant = 'text', className = '', count = 1 }: SkeletonProps): ReactElement {
  const base =
    'animate-pulse rounded-[var(--radius-control)] bg-surface-alt motion-reduce:animate-none';
  const cls = `${base} ${SIZE[variant]} ${className}`;
  if (count <= 1) {
    return <div className={cls} role="status" aria-label="Loading" aria-busy="true" />;
  }
  return (
    <div className="space-y-2" role="status" aria-label="Loading" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cls} />
      ))}
    </div>
  );
}
