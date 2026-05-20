import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApi } from '../api/hooks';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Both queries fire on mount (no `enabled` flag like tRPC's). They're tiny
  // and react-query caches; subsequent palette opens are instant.
  const partners = useApi.partners.list();
  const deals = useApi.deals.list();

  const results = useMemo(() => {
    const term = q.toLowerCase();
    const p = (partners.data ?? [])
      .filter((x) => x.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map((x) => ({ kind: 'Partner', label: x.name, to: `/partners/${x.id}` }));
    const d = (deals.data ?? [])
      .filter((x) => x.companyName.toLowerCase().includes(term))
      .slice(0, 5)
      .map((x) => ({ kind: 'Deal', label: x.companyName, to: `/deals` }));
    const nav = [
      { kind: 'Go', label: 'Dashboard', to: '/' },
      { kind: 'Go', label: 'Partners', to: '/partners' },
      { kind: 'Go', label: 'Deals', to: '/deals' },
      { kind: 'Go', label: 'Content', to: '/content' },
    ].filter((x) => x.label.toLowerCase().includes(term));
    return [...p, ...d, ...nav];
  }, [q, partners.data, deals.data]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 grid place-items-start justify-center bg-black/30 pt-[12vh]">
      <div className="w-[560px] overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search size={16} className="text-text-secondary" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search partners, deals, pages…"
            className="w-full text-body outline-none"
          />
          <kbd className="text-caption text-text-secondary">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-auto">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  navigate(r.to);
                  setOpen(false);
                  setQ('');
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-body hover:bg-surface-alt"
              >
                <span>{r.label}</span>
                <span className="text-caption text-text-secondary">{r.kind}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-small text-text-secondary">No matches.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
