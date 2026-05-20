import type { ReactElement } from 'react';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-surface-alt text-text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
};

const STATUS_TONE: Record<string, Tone> = {
  open: 'info',
  won: 'success',
  lost: 'danger',
  active: 'success',
  onboarding: 'warning',
  inactive: 'neutral',
  churned: 'danger',
  draft: 'neutral',
  published: 'success',
  pending: 'warning',
  paid: 'success',
  flagged: 'danger',
  accepted: 'success',
  rejected: 'neutral',
  merged: 'info',
};

export function StatusBadge({ status }: { status: string }): ReactElement {
  const tone = STATUS_TONE[status.toLowerCase()] ?? 'neutral';
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-control)] px-2 py-0.5 text-caption font-medium capitalize ${TONE_CLASS[tone]}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
