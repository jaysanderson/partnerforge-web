import { useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { getToken } from '../api/client';

interface Msg {
  role: 'user' | 'arag';
  text: string;
}

const QUICK = [
  'Pipeline health',
  'At-risk partners',
  'Which deals are in Negotiation?',
  'Summarise Northwind Cyber',
];

export function CopilotPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const send = async (q: string) => {
    if (!q.trim() || streaming) return;
    const history = messages;
    setMessages([...history, { role: 'user', text: q }, { role: 'arag', text: '' }]);
    setInput('');
    setStreaming(true);
    try {
      const res = await fetch('/ai/ask/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${getToken() ?? ''}` },
        body: JSON.stringify({
          query: q,
          scope: 'deal',
          context: history.map((m) => ({ author: m.role === 'user' ? 'USER' : 'ARAG', text: m.text })),
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
            /* ignore partial */
          }
          scroller.current?.scrollTo(0, scroller.current.scrollHeight);
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: 'arag', text: 'ARAG is temporarily unavailable.' };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <aside className="flex h-full w-[400px] flex-col bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-ai-accent" />
            <span className="font-heading font-semibold">Ask ARAG</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>
        <div className="border-b border-border bg-ai-surface px-4 py-1.5 text-caption text-ai-accent">
          Powered by Progress Agentic RAG
        </div>

        <div ref={scroller} className="flex-1 space-y-3 overflow-auto p-4">
          {messages.length === 0 && (
            <p className="text-small text-text-secondary">
              Ask about partners, deals, or pipeline. Answers are grounded in your Knowledge Boxes.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === 'user'
                  ? 'ml-8 rounded-[var(--radius-card)] bg-surface-alt p-3 text-body'
                  : 'mr-4 whitespace-pre-wrap rounded-[var(--radius-card)] border-l-2 border-ai-accent bg-ai-surface p-3 text-body'
              }
            >
              {m.text || (m.role === 'arag' && streaming ? '…' : '')}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="rounded-full border border-border px-2.5 py-1 text-caption text-text-secondary hover:border-ai-accent hover:text-ai-accent"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ARAG…"
            className="flex-1 rounded-[var(--radius-control)] border border-border px-3 py-2 text-body outline-none focus:border-border-focus"
          />
          <button
            type="submit"
            disabled={streaming}
            className="rounded-[var(--radius-control)] bg-progress-blue px-3 py-2 text-body font-medium text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </aside>
    </div>
  );
}
