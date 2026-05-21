/**
 * Salesforce OAuth landing. Salesforce (or the simulated provider) redirects
 * here with the `code` / `environment` params; we complete the exchange
 * server-side (tokens never touch the browser) and return to the Connection
 * wizard, which resumes at the Objects step now that the org is connected.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@partnerforge/ui';
import { useApi } from '../../api/hooks';

export function SfOAuthCallback(): ReactElement {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const complete = useApi.adminConfig.salesforceOAuthComplete();
  const ran = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const environment = (params.get('environment') as 'production' | 'sandbox') ?? 'sandbox';
    const code = params.get('code') ?? undefined;
    const redirectUri = `${window.location.origin}/console/sf/oauth/callback`;
    complete.mutate(
      { environment, code, redirectUri },
      {
        onSuccess: (cfg) => {
          toast.show({
            kind: 'success',
            title: `Connected to ${cfg.connection.orgName}`,
          });
          navigate('/sf/connection', { replace: true });
        },
        onError: (e: Error) => setError(e.message),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <h1>Connecting Salesforce…</h1>
      {error ? (
        <p className="pf-small text-danger-600">{error}</p>
      ) : (
        <p className="pf-small text-ink-3">Completing authorization, one moment…</p>
      )}
    </div>
  );
}
