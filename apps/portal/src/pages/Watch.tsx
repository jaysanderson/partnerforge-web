/**
 * Watch page — TubeRAG-style HTML5 player + transcript + scoped chat.
 *
 * Layout (1024px+): left 70 % = player + chapters + transcript / right 30 %
 * = scoped chat. Bottom = Up Next rail of sibling videos via /find.
 *
 * Below 1024px the columns stack vertically.
 */
import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, Sparkles } from 'lucide-react';
import { VideoCard } from '@partnerforge/ui';
import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';

interface ChapterMarker {
  start_seconds: number;
  title: string;
  summary?: string;
}

function fmtTimestamp(s: number): string {
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

/** Extract chapter markers from the ARAG resource shape (DA-agent output). */
function readChapters(aragResource: Record<string, unknown> | null | undefined): ChapterMarker[] {
  if (!aragResource) return [];
  const data = aragResource.data as Record<string, unknown> | undefined;
  const texts = data?.texts as Record<string, { body?: string }> | undefined;
  const raw = texts?.['tuberag-chapters']?.body;
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ChapterMarker[];
  } catch {
    /* ignore — chapter agent may not have run */
  }
  return [];
}

export function Watch(): ReactElement {
  const { id = '' } = useParams();
  const { t } = useI18n();
  const v = useApi.portal.videoGet({ id });
  const tx = useApi.portal.videoTranscript({ id });
  const upNext = useApi.portal.videoUpNext({ id });

  const row = v.data?.row as
    | {
        id: string;
        title: string;
        description: string | null;
        fileUrl: string | null;
        thumbnailUrl: string | null;
        durationSeconds: number | null;
        transcriptStatus: string | null;
      }
    | undefined;
  const chapters = readChapters(v.data?.aragResource);

  if (v.isLoading) {
    return <div className="p-8 text-[13px] text-ink-3">{t('Loading…')}</div>;
  }
  if (v.error || !row) {
    return (
      <div className="pf-fade-in space-y-3 p-2">
        <Link to="/library" className="inline-flex items-center gap-1 text-[12px] text-brand-600">
          <ArrowLeft size={12} /> {t('Back to Library')}
        </Link>
        <h1>{t('Video not found')}</h1>
      </div>
    );
  }

  return (
    <div className="pf-fade-in space-y-6 pb-12">
      <div>
        <Link
          to="/library"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-600 no-underline hover:underline"
        >
          <ArrowLeft size={12} /> {t('Back to Library')}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Left column — player + chapters + transcript */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-black shadow-[var(--shadow-md)]">
            {row.fileUrl ? (
              <video
                key={row.fileUrl}
                src={row.fileUrl}
                poster={row.thumbnailUrl ?? undefined}
                controls
                className="aspect-video w-full bg-black"
              />
            ) : (
              <div className="aspect-video w-full grid place-items-center bg-subtle text-ink-3">
                {t('Video file unavailable')}
              </div>
            )}
          </div>

          <div>
            <h1>{row.title}</h1>
            {row.description && <p className="mt-2 max-w-3xl text-[14px] text-ink-2">{row.description}</p>}
          </div>

          {chapters.length > 0 && (
            <section className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5">
              <h2 className="mb-3">{t('Chapters')}</h2>
              <ul className="space-y-1.5">
                {chapters.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-3 text-[13px] text-ink-2 hover:text-ink-1"
                  >
                    <span className="w-12 shrink-0 font-mono text-[12px] text-ink-3">
                      {fmtTimestamp(c.start_seconds)}
                    </span>
                    <span className="font-medium text-ink-1">{c.title}</span>
                    {c.summary && <span className="line-clamp-1 text-ink-3">— {c.summary}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <h2 className="mb-3">{t('Transcript')}</h2>
            {tx.isLoading ? (
              <p className="text-[12.5px] text-ink-3">{t('Loading…')}</p>
            ) : (tx.data?.paragraphs ?? []).length === 0 ? (
              <p className="text-[12.5px] text-ink-3">
                {row.transcriptStatus === 'ready'
                  ? t('Transcript not available for this video.')
                  : t('Transcript is still being generated. Refresh in a moment.')}
              </p>
            ) : (
              <div className="max-h-[480px] space-y-2.5 overflow-y-auto pr-2 text-[13px] leading-relaxed text-ink-2">
                {(tx.data?.paragraphs ?? []).map((p, i) => (
                  <p key={i}>{p.text}</p>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — scoped ARAG chat */}
        <WatchChat videoId={row.id} videoTitle={row.title} />
      </div>

      {/* Up Next rail */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2>{t('Up Next')}</h2>
          <Link
            to="/library"
            className="flex items-center gap-1 text-[12px] text-brand-600 no-underline hover:underline"
          >
            {t('All videos')} <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(upNext.data?.hits ?? []).slice(0, 4).map((h) =>
            h.localId ? (
              <VideoCard
                key={h.localId}
                href={`/library/video/${h.localId}`}
                title={h.title}
                description={h.description}
                thumbnailUrl={h.thumbnailUrl}
                durationSeconds={h.durationSeconds}
                typeChip="Video"
              />
            ) : null,
          )}
          {(upNext.data?.hits ?? []).length === 0 && (
            <p className="text-[12.5px] text-ink-3">{t('Nothing else just yet.')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

interface ChatMsg {
  author: 'USER' | 'ARAG';
  text: string;
}

function WatchChat({ videoId, videoTitle }: { videoId: string; videoTitle: string }): ReactElement {
  const { t } = useI18n();
  const ask = useApi.portal.videoAsk();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState('');

  const send = () => {
    const q = draft.trim();
    if (!q || ask.isPending) return;
    const history = messages;
    setMessages([...history, { author: 'USER', text: q }]);
    setDraft('');
    ask.mutate(
      { id: videoId, query: q, context: history },
      {
        onSuccess: (res) => {
          if (res.ok) setMessages((m) => [...m, { author: 'ARAG', text: res.answer ?? '' }]);
          else
            setMessages((m) => [
              ...m,
              { author: 'ARAG', text: res.answer ?? t('Sorry — the assistant is unavailable.') },
            ]);
        },
      },
    );
  };

  return (
    <aside className="pf-card-hover sticky top-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="pf-ai-pulse grid h-7 w-7 place-items-center rounded-full text-white pf-ai-gradient">
          <Sparkles size={13} />
        </span>
        <h2 className="text-[16px]">{t('Ask about this video')}</h2>
      </div>
      <p className="mb-3 line-clamp-2 text-[12.5px] text-ink-3">
        {t('Grounded answers from this video\'s transcript via ARAG.')}
      </p>

      <div className="mb-3 max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="space-y-2 text-[12.5px] text-ink-3">
            <p>{t('Try a question, for example:')}</p>
            <ul className="space-y-1">
              {[
                `${t('Summarise the main points of')} "${videoTitle}".`,
                t('What products are mentioned in this video?'),
                t('Who would benefit most from watching this?'),
              ].map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => setDraft(q)}
                    className="block rounded-md border border-border bg-canvas px-2.5 py-1.5 text-left text-ink-2 transition-colors hover:border-border-strong hover:text-ink-1"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={
                m.author === 'USER'
                  ? 'ml-6 rounded-[var(--radius-md)] bg-subtle p-2.5 text-[12.5px] text-ink-1'
                  : 'mr-3 whitespace-pre-wrap rounded-[var(--radius-md)] border-l-2 border-brand-500 bg-brand-50/60 p-2.5 text-[12.5px] text-ink-1'
              }
            >
              {m.text || (m.author === 'ARAG' && ask.isPending ? '…' : '')}
            </div>
          ))
        )}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('Ask anything…')}
          className="flex-1 rounded-md border border-border-strong bg-surface px-2.5 py-2 text-[13px] text-ink-1 outline-none focus:border-brand-500 focus:shadow-[var(--shadow-ring)]"
        />
        <button
          type="submit"
          disabled={ask.isPending}
          aria-label={t('Send')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white shadow-[var(--shadow-xs)] hover:bg-brand-700 disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
}
