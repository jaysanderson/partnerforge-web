import { useEffect, useState } from 'react';
import { useApi, useApiUtils } from '../api/hooks';

/** Narrow no-code config: edit partner-facing field labels/visibility and the
 *  Brandfolder asset surface. Changes apply live (read by sf.fieldMeta / portal). */
export function AdminConfig() {
  const utils = useApiUtils();
  const fields = useApi.adminConfig.oppFieldOverrides();
  const brand = useApi.adminConfig.sharepointAssets();
  const setFields = useApi.adminConfig.setOppFieldOverrides();
  const setBrand = useApi.adminConfig.setSharepointAssets();

  const [fJson, setFJson] = useState('');
  const [bJson, setBJson] = useState('');
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (fields.data) setFJson(JSON.stringify(fields.data, null, 2));
  }, [fields.data]);
  useEffect(() => {
    if (brand.data) setBJson(JSON.stringify(brand.data, null, 2));
  }, [brand.data]);

  if (fields.error) {
    return (
      <div className="space-y-2">
        <h1 >Configuration</h1>
        <p className="text-small text-danger">{fields.error.message} — admin only.</p>
      </div>
    );
  }

  const save = (which: 'fields' | 'brand') => {
    setErr(null);
    try {
      if (which === 'fields') {
        setFields.mutate(JSON.parse(fJson), {
          onSuccess: () => utils.adminConfig.oppFieldOverrides.invalidate(),
        });
      } else {
        setBrand.mutate(JSON.parse(bJson), {
          onSuccess: () => utils.adminConfig.sharepointAssets.invalidate(),
        });
      }
    } catch {
      setErr('Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 >Configuration</h1>
        <p className="text-small text-text-secondary">
          Business-admin settings — no engineering required. Changes apply immediately across the
          partner experience.
        </p>
      </div>

      <Card title="Opportunity field labels & visibility (R28/R29)">
        <textarea
          value={fJson}
          onChange={(e) => setFJson(e.target.value)}
          rows={8}
          className="w-full rounded-[var(--radius-control)] border border-border bg-surface-alt p-3 font-mono text-caption"
        />
        <button
          type="button"
          onClick={() => save('fields')}
          disabled={setFields.isPending}
          className="mt-2 rounded-[var(--radius-control)] bg-progress-blue px-4 py-1.5 text-small font-medium text-white disabled:opacity-50"
        >
          {setFields.isPending ? 'Saving…' : 'Save & apply live'}
        </button>
      </Card>

      <Card title="SharePoint brand assets (R2) — surfaced in the partner Content Library">
        <textarea
          value={bJson}
          onChange={(e) => setBJson(e.target.value)}
          rows={10}
          className="w-full rounded-[var(--radius-control)] border border-border bg-surface-alt p-3 font-mono text-caption"
        />
        <button
          type="button"
          onClick={() => save('brand')}
          disabled={setBrand.isPending}
          className="mt-2 rounded-[var(--radius-control)] bg-progress-blue px-4 py-1.5 text-small font-medium text-white disabled:opacity-50"
        >
          {setBrand.isPending ? 'Saving…' : 'Save & apply live'}
        </button>
      </Card>
      {err && <p className="text-small text-danger">{err}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pf-card-hover rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-3 text-subhead font-semibold">{title}</h2>
      {children}
    </div>
  );
}
