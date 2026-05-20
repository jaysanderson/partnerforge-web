/**
 * StatusBadge — per-stage semantic pill.
 *
 * Reviewer wanted explicit stage→colour mapping rather than a generic
 * 5-tone palette. Deal stages get a proper ramp (sky / blue / violet /
 * amber / emerald / zinc) so the Kanban + Opportunities table read at a
 * glance. Other statuses (active / pending / paid …) keep the original
 * semantic tones.
 *
 * Renders as an 11 px pill, weight 500, with an optional 6 px coloured
 * dot prefix for at-a-glance reads. Per the reviewer's spec.
 */
import type { ReactElement } from 'react';

interface ToneSpec {
  bg: string;
  text: string;
  dot: string;
}

/** Deal-stage tones — semantic colour ramp per the design review. */
const STAGE_TONE: Record<string, ToneSpec> = {
  registered: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  qualified: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  proposal: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  negotiation: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'closed won': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'closed lost': { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
};

/** Non-stage statuses — partner state, asset state, submission state. */
const STATUS_TONE: Record<string, ToneSpec> = {
  // Partner status
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  onboarding: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  at_risk: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  inactive: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  churned: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

  // Asset status
  expiring: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  expired: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },

  // Deal status (overall)
  open: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  won: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  lost: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },

  // Submission / approvals
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  rejected: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  auto_approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },

  // Content + course
  draft: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },

  // Certification status
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  cancelled: { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },

  // Commissions
  paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  flagged: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  merged: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

const NEUTRAL: ToneSpec = { bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' };

export function StatusBadge({
  status,
  withDot = true,
}: {
  status: string;
  withDot?: boolean;
}): ReactElement {
  const key = status.toLowerCase().trim();
  const tone = STAGE_TONE[key] ?? STATUS_TONE[key] ?? NEUTRAL;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${tone.bg} ${tone.text}`}
    >
      {withDot && <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />}
      {status.replace(/_/g, ' ')}
    </span>
  );
}
