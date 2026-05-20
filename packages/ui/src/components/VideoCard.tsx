/**
 * VideoCard — the Library video grid tile.
 *
 * Linear-style restraint: 16:9 thumbnail with a Play overlay on hover,
 * duration badge in the bottom-right of the thumbnail, title in ink-1,
 * description in ink-3 clamped to 2 lines. Whole card is the link target.
 */
import type { ReactElement } from 'react';
import { Play } from 'lucide-react';

export interface VideoCardProps {
  href: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  /** Optional little type chip top-left (e.g. "Demo Script"). */
  typeChip?: string | null;
}

function fmtDuration(s: number | null | undefined): string {
  if (!s || s < 0) return '';
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

export function VideoCard({
  href,
  title,
  description,
  thumbnailUrl,
  durationSeconds,
  typeChip,
}: VideoCardProps): ReactElement {
  return (
    <a
      href={href}
      className="pf-card-hover group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface no-underline"
    >
      {/* 16:9 thumbnail with overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-subtle">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-3">
            <Play size={32} />
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-ink-1 opacity-0 shadow-[var(--shadow-md)] transition-opacity duration-200 group-hover:opacity-100">
            <Play size={20} className="ml-0.5" />
          </span>
        </div>
        {/* Duration badge */}
        {durationSeconds != null && durationSeconds > 0 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white">
            {fmtDuration(durationSeconds)}
          </span>
        )}
        {/* Type chip top-left */}
        {typeChip && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-2 shadow-[var(--shadow-xs)]">
            {typeChip}
          </span>
        )}
      </div>

      {/* Title + description */}
      <div className="p-4">
        <div className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink-1">
          {title}
        </div>
        {description && (
          <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-3">
            {description}
          </div>
        )}
      </div>
    </a>
  );
}
