import type { ReactElement } from 'react';
import type { PartnerTier } from '@partnerforge/shared';

const TIER_CLASS: Record<PartnerTier, string> = {
  Registered: 'bg-surface-alt text-text-secondary border-border',
  Silver: 'bg-surface-alt text-text-primary border-border',
  Gold: 'bg-warning/10 text-warning border-warning/30',
  Platinum: 'bg-info/10 text-info border-info/30',
  Strategic: 'bg-progress-dark text-text-on-dark border-progress-dark',
};

export function TierBadge({ tier }: { tier: PartnerTier }): ReactElement {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-control)] border px-2 py-0.5 text-caption font-medium ${TIER_CLASS[tier]}`}
    >
      {tier}
    </span>
  );
}
