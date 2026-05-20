/**
 * EmptyState — one component, three voices.
 *
 * Replaces the bare "No records." strings the UX audit called out. Every
 * list / card / chart that can be empty should render this instead of a
 * single sentence. Three variants:
 *
 *   variant="zero-data"     — fresh tenant, never had this kind of record.
 *                              Show what the record IS, why it matters,
 *                              and a primary CTA to create the first one.
 *   variant="zero-results"  — there ARE records but the current filter
 *                              hides them all. CTA = clear filters.
 *   variant="error"         — async failure. Friendly message + retry.
 *   variant="coming-soon"   — feature stub. Honest about the timing,
 *                              points at the live API surface so devs can
 *                              integrate today.
 *
 * Visual: centered, generous padding, an icon (not a sad illustration —
 * Lucide's geometric icons feel calm and product-y; we can swap to
 * illustrations later without changing this contract).
 */
import type { ComponentType, ReactElement, ReactNode } from 'react';
import {
  AlertCircle,
  Construction,
  FilterX,
  Inbox,
  RefreshCw,
} from 'lucide-react';

type Variant = 'zero-data' | 'zero-results' | 'error' | 'coming-soon';

interface EmptyStateProps {
  variant?: Variant;
  /** Big headline. Required. */
  title: string;
  /** One-sentence explanation under the title. */
  body?: ReactNode;
  /** Optional override for the default per-variant icon. */
  icon?: ComponentType<{ size?: number | string }>;
  /** Primary action — usually only present on zero-data + error. */
  action?: {
    label: string;
    onClick: () => void;
    /** Render as a link instead of a button. */
    href?: string;
  };
  /** Secondary action, rendered as a quieter button next to the primary. */
  secondaryAction?: { label: string; onClick: () => void };
  /** Extra freeform content slot (e.g. API endpoint hint, docs link). */
  children?: ReactNode;
  /** Smaller / inline variant for use inside cards rather than full pages. */
  compact?: boolean;
}

const DEFAULT_ICON: Record<Variant, ComponentType<{ size?: number | string }>> = {
  'zero-data': Inbox,
  'zero-results': FilterX,
  error: AlertCircle,
  'coming-soon': Construction,
};

const TONE: Record<Variant, { iconBg: string; iconFg: string }> = {
  'zero-data': { iconBg: 'bg-surface-alt', iconFg: 'text-text-secondary' },
  'zero-results': { iconBg: 'bg-ai-surface', iconFg: 'text-progress-blue' },
  error: { iconBg: 'bg-danger/10', iconFg: 'text-danger' },
  'coming-soon': { iconBg: 'bg-warning/10', iconFg: 'text-warning' },
};

export function EmptyState({
  variant = 'zero-data',
  title,
  body,
  icon,
  action,
  secondaryAction,
  children,
  compact = false,
}: EmptyStateProps): ReactElement {
  const Icon = icon ?? DEFAULT_ICON[variant];
  const tone = TONE[variant];
  const pad = compact ? 'py-6' : 'py-12';
  const iconSize = compact ? 18 : 24;
  const iconBox = compact ? 'h-9 w-9' : 'h-12 w-12';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center justify-center gap-3 px-6 text-center ${pad}`}
    >
      <div
        className={`grid ${iconBox} place-items-center rounded-full ${tone.iconBg} ${tone.iconFg}`}
        aria-hidden
      >
        <Icon size={iconSize} />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className={`font-heading font-semibold ${compact ? 'text-body' : 'text-subhead'}`}>
          {title}
        </h3>
        {body && <p className="text-small text-text-secondary">{body}</p>}
      </div>
      {(action || secondaryAction) && (
        <div className="mt-1 flex items-center gap-2">
          {action &&
            (action.href ? (
              <a
                href={action.href}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white"
              >
                {variant === 'error' && <RefreshCw size={14} />}
                {action.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white"
              >
                {variant === 'error' && <RefreshCw size={14} />}
                {action.label}
              </button>
            ))}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="rounded-[var(--radius-control)] border border-border px-4 py-2 text-small text-text-primary hover:bg-surface-alt"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
      {children && <div className="mt-2 text-caption text-text-secondary">{children}</div>}
    </div>
  );
}
