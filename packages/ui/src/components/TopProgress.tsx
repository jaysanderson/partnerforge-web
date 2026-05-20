/**
 * TopProgress — 2 px loading bar at the top of the viewport.
 *
 * The "modern app" signal Linear/Vercel/Stripe all use. Renders nothing
 * by default; pass `loading={true}` to show. Callers wire it to whatever
 * pending state matters in their app (react-router navigation, react-query
 * isFetching across critical queries, etc.).
 *
 * Auto-hides when `loading` flips false. No layout shift (position:fixed).
 */
import type { ReactElement } from 'react';

interface TopProgressProps {
  loading: boolean;
}

export function TopProgress({ loading }: TopProgressProps): ReactElement | null {
  if (!loading) return null;
  return <div className="pf-nav-progress" aria-hidden />;
}
