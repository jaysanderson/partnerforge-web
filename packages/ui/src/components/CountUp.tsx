/**
 * CountUp — animate a number from 0 → value on mount.
 *
 * Used by `MetricCard` so KPI numbers come alive instead of slamming into
 * place. Pure raf, no deps. Honors `prefers-reduced-motion: reduce` by
 * skipping the animation and rendering the final value immediately.
 *
 * Usage:
 *   <CountUp value={5_200_000} format={(n) => money(n)} />
 *
 * The animation runs once per mount. Re-mount (route change, key change)
 * re-runs it; updates to `value` while mounted don't re-animate (the
 * sparkline shows the trend, not this).
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';

interface CountUpProps {
  value: number;
  /** Duration in ms. Default 600. */
  durationMs?: number;
  /** Format the animating intermediate number → string. */
  format?: (n: number) => string;
}

/** Ease-out cubic — feels snappy without overshooting. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function CountUp({
  value,
  durationMs = 600,
  format = (n) => Math.round(n).toLocaleString(),
}: CountUpProps): ReactElement {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      // Subsequent updates: jump directly.
      setDisplay(value);
      return;
    }
    startedRef.current = true;

    if (prefersReducedMotion() || value === 0) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(value * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <>{format(display)}</>;
}
