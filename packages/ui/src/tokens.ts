/**
 * TS-typed design tokens. Mirrors `tokens.css` so non-Tailwind code paths
 * (SVG `stroke`, inline styles, JS-driven theming) can pull the same
 * colour / spacing values that Tailwind sees.
 *
 * Source of truth is *still* `tokens.css` (Tailwind 4 reads `@theme`
 * directly) — this file just re-exports for TS. If you change a value,
 * update both places.
 */

/** Brand + status colour tokens. */
export const color = {
  // Brand
  progressGreen: '#5ce500',
  progressDark: '#1b1f3b',
  progressBlue: '#0d6efd',
  progressRed: '#e5214e',

  // Surfaces
  background: '#f5f5f7',
  surface: '#ffffff',
  surfaceAlt: '#edf0f4',
  border: '#d1d5db',
  borderFocus: '#0d6efd',

  // Text
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textOnDark: '#ffffff',
  textOnGreen: '#1b1f3b',

  // Semantic status
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0d6efd',

  // AI / ARAG
  aiAccent: '#0d6efd',
  aiSurface: '#eff6ff',
} as const;

/**
 * Pipeline / deal-stage colours. Stable per stage; used by the dashboard
 * Pipeline-by-Stage bar and any future stage-coloured chart.
 */
export const stageColor: Record<string, string> = {
  Registered: '#94A3B8',
  Qualified: color.progressBlue,
  Proposal: color.warning,
  Negotiation: color.progressGreen,
  'Closed Won': color.success,
  'Closed Lost': color.danger,
};

/** 4-grid spacing scale. Use numbers for inline `style.padding` etc. */
export const space = {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 12,
  6: 16,
  7: 20,
  8: 24,
  9: 32,
  10: 40,
  11: 48,
  12: 64,
} as const;

/** Type scale in px. Tailwind's text-* aliases shadow these — see tokens.css. */
export const fontSize = {
  caption: 12,
  small: 13,
  body: 14,
  subhead: 16,
  section: 20,
  page: 24,
  hero: 32,
} as const;

/** Radii. Two values keep things calm — controls and cards. */
export const radius = {
  control: 4,
  card: 6,
} as const;

/** Elevation — one card shadow only. Cards float, dialogs rely on overlay. */
export const elevation = {
  card: '0 1px 3px rgba(0,0,0,0.08)',
  pop: '0 4px 12px rgba(0,0,0,0.10)',
} as const;

/** Motion. Functional only — no decorative animation. */
export const motion = {
  fastMs: 120,
  baseMs: 200,
  sheetMs: 320,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/** Type-safe access to design tokens for export consumers. */
export type Color = typeof color;
export type Space = typeof space;
