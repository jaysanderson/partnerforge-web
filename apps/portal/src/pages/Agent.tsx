import { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import { getToken } from '../api/client';

interface Msg {
  role: 'user' | 'arag';
  text: string;
}
const CHIPS = [
  'What products fit a healthcare customer?',
  'Help me position against ServiceNow',
  'What training should I complete next?',
];

export function Agent() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const send = async (q: string) => {
    if (!q.trim() || busy) return;
    const history = messages;
    setMessages([...history, { role: 'user', text: q }, { role: 'arag', text: '' }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/portal/agent/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${getToken() ?? ''}` },
        body: JSON.stringify({
          query: q,
          context: history.map((m) => ({
            author: m.role === 'user' ? 'USER' : 'ARAG',
            text: m.text,
          })),
        }),
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('no stream');
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';
        for (const p of parts) {
          const line = p.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const obj = JSON.parse(payload) as { text?: string; error?: string };
            const add = obj.text ?? (obj.error ? `\n[${obj.error}]` : '');
            setMessages((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              if (last) copy[copy.length - 1] = { role: 'arag', text: last.text + add };
              return copy;
            });
          } catch {
            /* partial */
          }
          scroller.current?.scrollTo(0, scroller.current.scrollHeight);
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'arag', text: 'The assistant is temporarily unavailable.' };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={18} className="text-ai-accent" />
        <h1 >{t('AI Assistant')}</h1>
        <span className="rounded-full bg-ai-surface px-2 py-0.5 text-caption text-ai-accent">
          {t('Powered by Progress Agentic RAG')}
        </span>
      </div>

      <div
        ref={scroller}
        className="flex-1 space-y-3 overflow-auto rounded-[var(--radius-card)] border border-border bg-surface p-4"
      >
        {messages.length === 0 && (
          <p className="text-small text-text-secondary">
            {t(
              'Ask about products, pricing, positioning, or training. Answers are grounded in Progress enablement content.',
            )}
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'ml-12 rounded-[var(--radius-card)] bg-surface-alt p-3 text-body'
                : 'mr-8 whitespace-pre-wrap rounded-[var(--radius-card)] border-l-2 border-ai-accent bg-ai-surface p-3 text-body'
            }
          >
            {m.text || (m.role === 'arag' && busy ? '…' : '')}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => send(c)}
            className="rounded-full border border-border px-3 py-1 text-caption text-text-secondary hover:border-ai-accent hover:text-ai-accent"
          >
            {t(c)}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('Ask the assistant…')}
          className="flex-1 rounded-[var(--radius-control)] border border-border px-3 py-2.5 text-body outline-none focus:border-border-focus"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-[var(--radius-control)] bg-progress-blue px-4 py-2.5 text-body font-medium text-white disabled:opacity-50"
        >
          {t('Send')}
        </button>
      </form>
    </div>
  );
}
