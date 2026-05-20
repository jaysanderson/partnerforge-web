import { useState } from 'react';
import { useAuth } from '../auth';

const DEMO = [
  { email: 'admin@progress.com', label: 'Admin — full access' },
  { email: 'pm@progress.com', label: 'Partner Manager' },
  { email: 'se@progress.com', label: 'Sales Engineer' },
  { email: 'ro@progress.com', label: 'Read-only' },
];

export function Login() {
  const { login } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const go = async (email: string) => {
    setBusy(email);
    setErr(null);
    try {
      await login(email);
    } catch {
      setErr('Login failed — is the API running?');
      setBusy(null);
    }
  };

  return (
    <div className="grid min-h-full place-items-center bg-progress-dark">
      <div className="w-[380px] rounded-[var(--radius-card)] bg-surface p-8 shadow-[var(--shadow-card)]">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-[var(--radius-control)] bg-progress-green font-bold text-text-on-green">
            P
          </div>
          <div>
            <div className="font-heading text-section font-semibold">PartnerForge</div>
            <div className="text-caption text-text-secondary">Progress Partner Network · Console</div>
          </div>
        </div>
        <p className="mb-4 text-small text-text-secondary">
          Internal staff sign in via corporate SSO in production. Development sign-in:
        </p>
        <div className="space-y-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              disabled={busy !== null}
              onClick={() => go(d.email)}
              className="flex w-full items-center justify-between rounded-[var(--radius-control)] border border-border px-4 py-2.5 text-left text-body hover:border-progress-blue hover:bg-surface-alt disabled:opacity-50"
            >
              <span className="font-medium">{d.label}</span>
              <span className="text-caption text-text-secondary">
                {busy === d.email ? '…' : d.email}
              </span>
            </button>
          ))}
        </div>
        {err && <p className="mt-4 text-small text-danger">{err}</p>}
      </div>
    </div>
  );
}
