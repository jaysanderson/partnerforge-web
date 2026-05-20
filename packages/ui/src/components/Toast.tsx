/**
 * Toast notifications — non-blocking success / info / warning / error
 * messages with optional Undo for reversible actions.
 *
 * Design:
 *   - Single ToastProvider at app root (wraps Routes).
 *   - `useToast()` hook returns `{ show, dismiss }`.
 *   - Auto-dismiss after 5 s (configurable per toast).
 *   - Stacks bottom-right; max 5 visible.
 *   - Respects `prefers-reduced-motion: reduce` (no slide animation).
 *   - Polite aria-live region so screen readers announce each toast once.
 *
 * Why hand-rolled (no react-hot-toast / sonner): zero deps, full control
 * over styling against tokens, ~80 lines, and Toast is foundational
 * enough to live in the design system.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'warning' | 'error';

interface ToastSpec {
  id: string;
  kind: ToastKind;
  title: string;
  body?: ReactNode;
  /** Override the default 5 s dismiss. Pass 0 for sticky. */
  duration?: number;
  /** Render an Undo button that fires this callback and dismisses. */
  undo?: () => void | Promise<void>;
}

interface ToastContextValue {
  show: (t: Omit<ToastSpec, 'id'>) => string;
  dismiss: (id: string) => void;
}

const Ctx = createContext<ToastContextValue | null>(null);

const ICON: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const TONE: Record<ToastKind, string> = {
  success: 'border-success/30 bg-surface text-text-primary',
  info: 'border-progress-blue/30 bg-surface text-text-primary',
  warning: 'border-warning/30 bg-surface text-text-primary',
  error: 'border-danger/30 bg-surface text-text-primary',
};

const ICON_TONE: Record<ToastKind, string> = {
  success: 'text-success',
  info: 'text-progress-blue',
  warning: 'text-warning',
  error: 'text-danger',
};

export function ToastProvider({ children }: { children: ReactNode }): ReactElement {
  const [items, setItems] = useState<ToastSpec[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastContextValue['show']>((spec) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => {
      // Cap at 5 — oldest gets dropped if we exceed.
      const next = [...prev, { ...spec, id }];
      return next.slice(-5);
    });
    return id;
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastSpec; onDismiss: () => void }): ReactElement {
  const Icon = ICON[toast.kind];

  useEffect(() => {
    const ms = toast.duration ?? 5000;
    if (ms <= 0) return;
    const id = setTimeout(onDismiss, ms);
    return () => clearTimeout(id);
  }, [toast.duration, onDismiss]);

  return (
    <div
      role={toast.kind === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start gap-3 rounded-[var(--radius-card)] border bg-surface p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] motion-safe:animate-[toast-in_180ms_ease-out] ${TONE[toast.kind]}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${ICON_TONE[toast.kind]}`} />
      <div className="min-w-0 flex-1">
        <div className="text-small font-medium">{toast.title}</div>
        {toast.body && <div className="mt-0.5 text-caption text-text-secondary">{toast.body}</div>}
        {toast.undo && (
          <button
            type="button"
            onClick={() => {
              void toast.undo?.();
              onDismiss();
            }}
            className="mt-1.5 text-caption font-medium text-progress-blue hover:underline"
          >
            Undo
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="text-text-secondary hover:text-text-primary"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Soft fallback so a component used outside the provider doesn't crash —
    // logs the toast to the console instead. Keeps Storybook + tests simple.
    return {
      show: (t) => {
        // eslint-disable-next-line no-console
        console.warn('[toast — no provider]', t);
        return '';
      },
      dismiss: () => {
        /* no-op */
      },
    };
  }
  return ctx;
}

// Inject the toast-in keyframe once at module load. Tailwind 4's @theme
// covers tokens but not animations; this is a minimal global injection
// (only fires in the browser).
if (typeof document !== 'undefined') {
  const ID = 'pf-toast-keyframes';
  if (!document.getElementById(ID)) {
    const style = document.createElement('style');
    style.id = ID;
    style.textContent = `
@keyframes toast-in {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`;
    document.head.appendChild(style);
  }
}
