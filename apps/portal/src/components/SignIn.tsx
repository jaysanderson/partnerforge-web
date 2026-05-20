import { useState } from 'react';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';

const SEED = ['dana@northwindcyber.com', 'jon@luminasi.eu', 'mia@apexdata.com.au'];

export function SignIn() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = async (e: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await signIn(e);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('Sign-in failed'));
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-full place-items-center bg-progress-dark">
      <div className="w-[400px] rounded-[var(--radius-card)] bg-surface p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-[var(--radius-control)] bg-progress-green font-bold text-text-on-green">
            P
          </div>
          <div>
            <div className="font-heading text-section font-semibold">
              {t('Progress Partner Portal')}
            </div>
            <div className="text-caption text-text-secondary">{t('Passwordless sign-in')}</div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void go(email);
          }}
          className="space-y-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('you@yourcompany.com')}
            className="w-full rounded-[var(--radius-control)] border border-border px-3 py-2.5 text-body outline-none focus:border-border-focus"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[var(--radius-control)] bg-progress-blue py-2.5 text-body font-medium text-white disabled:opacity-50"
          >
            {busy ? t('Signing in…') : t('Send magic link')}
          </button>
        </form>
        {msg && <p className="mt-3 text-small text-text-secondary">{msg}</p>}
        <p className="mt-6 text-caption text-text-secondary">{t('Demo partner accounts:')}</p>
        <div className="mt-1 space-y-1">
          {SEED.map((e) => (
            <button
              key={e}
              type="button"
              disabled={busy}
              onClick={() => {
                setEmail(e);
                void go(e);
              }}
              className="block w-full rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-left text-caption hover:bg-surface-alt"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
