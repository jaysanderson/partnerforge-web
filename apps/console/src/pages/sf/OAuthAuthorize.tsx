/**
 * Simulated Salesforce OAuth consent screen.
 *
 * Stands in for the real `login.salesforce.com` authorize page when no
 * Connected App is configured (demo). It makes "Connect to Salesforce" a
 * tangible step — you see what's being authorized and click Allow — without
 * needing a real org. On Allow it hands off to our callback, which completes
 * the (simulated) token exchange server-side.
 *
 * With a real Connected App configured, this page is never reached: the
 * Connect button redirects straight to Salesforce instead.
 */
import type { ReactElement } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Cloud, Database, ShieldCheck } from 'lucide-react';

export function SfOAuthAuthorize(): ReactElement {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const environment = (params.get('environment') as 'production' | 'sandbox') ?? 'sandbox';
  const state = params.get('state') ?? '';
  const host = environment === 'sandbox' ? 'test.salesforce.com' : 'login.salesforce.com';

  const allow = () =>
    navigate(
      `/sf/oauth/callback?simulated=1&code=sim_code&state=${encodeURIComponent(state)}`,
      { replace: true },
    );
  const deny = () => navigate('/sf/connection', { replace: true });

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-lg)]">
        {/* Salesforce-style header band */}
        <div className="flex items-center gap-2 border-b border-border bg-[#032d60] px-5 py-4 text-white">
          <Cloud size={20} />
          <span className="font-semibold">Salesforce</span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.7rem]">
            {environment === 'sandbox' ? <Database size={11} /> : <Cloud size={11} />}
            {host}
          </span>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-subtle p-2 text-brand-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="mb-1">Allow access?</h2>
              <p className="pf-small text-ink-2">
                <span className="font-medium text-ink-1">PartnerForge</span> is requesting
                permission to access your Salesforce {environment} org.
              </p>
            </div>
          </div>

          <ul className="rounded-lg bg-subtle p-3 pf-small text-ink-2 space-y-1">
            <li>• Read Accounts, Contacts, and Opportunities</li>
            <li>• Maintain this access when you're offline (refresh token)</li>
          </ul>

          <p className="pf-micro text-ink-3">
            This is a simulated consent screen for the demo. Configure a Salesforce Connected
            App to use a real org.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={deny}
              className="rounded-md border border-border bg-surface px-4 py-2 pf-small font-medium text-ink-1 hover:bg-subtle"
            >
              Deny
            </button>
            <button
              type="button"
              onClick={allow}
              className="rounded-md bg-brand-600 px-5 py-2 pf-small font-medium text-white hover:bg-brand-700"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
