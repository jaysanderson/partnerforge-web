/**
 * HeroBand — subtle gradient strip behind a page header.
 *
 * Linear-style restraint: a single soft gradient that tints the top of
 * the page so it doesn't read as a generic SaaS template. Tier-aware so
 * Gold partners get a warm amber tint, Platinum a cool slate, Strategic
 * a green-tinted band, Silver/Registered a neutral one.
 *
 * Rendered as a container `div` — wrap your existing header markup in it.
 * Provides 24px of bottom padding so the gradient extends below the H1.
 */
import type { ReactElement, ReactNode } from 'react';

type Tier = 'Gold' | 'Platinum' | 'Silver' | 'Strategic' | 'Registered';

interface HeroBandProps {
  /** Optional tier to tint the gradient. Default: neutral. */
  tier?: Tier | null;
  /** Optional intensity 0–1. Default 1. */
  intensity?: number;
  children: ReactNode;
}

/**
 * Tier-tinted gradients — kept muted on purpose. Linear, not Lisa Frank.
 * Each tier picks one "from" colour that fades into the page background.
 */
const TIER_GRADIENT: Record<Tier, string> = {
  Gold:
    'linear-gradient(180deg, rgba(217, 119, 6, 0.10) 0%, rgba(217, 119, 6, 0.04) 45%, rgba(217, 119, 6, 0) 100%)',
  Platinum:
    'linear-gradient(180deg, rgba(13, 110, 253, 0.10) 0%, rgba(13, 110, 253, 0.04) 45%, rgba(13, 110, 253, 0) 100%)',
  Strategic:
    'linear-gradient(180deg, rgba(22, 163, 74, 0.10) 0%, rgba(22, 163, 74, 0.04) 45%, rgba(22, 163, 74, 0) 100%)',
  Silver:
    'linear-gradient(180deg, rgba(100, 116, 139, 0.10) 0%, rgba(100, 116, 139, 0.04) 45%, rgba(100, 116, 139, 0) 100%)',
  Registered:
    'linear-gradient(180deg, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.03) 45%, rgba(100, 116, 139, 0) 100%)',
};

const NEUTRAL =
  'linear-gradient(180deg, rgba(13, 110, 253, 0.06) 0%, rgba(13, 110, 253, 0.02) 50%, rgba(13, 110, 253, 0) 100%)';

export function HeroBand({ tier, intensity = 1, children }: HeroBandProps): ReactElement {
  const gradient = tier ? TIER_GRADIENT[tier] : NEUTRAL;
  return (
    <div
      className="-mx-6 -mt-6 px-6 pb-6 pt-6 lg:-mx-8 lg:-mt-8 lg:px-8 lg:pt-8"
      style={{
        background: gradient,
        opacity: intensity,
      }}
    >
      {children}
    </div>
  );
}
