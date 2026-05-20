import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import { useApi, useApiUtils } from '../api/hooks';
import { shortDate } from '../lib';

export function Forms() {
  const { t } = useI18n();
  const utils = useApiUtils();
  const forms = useApi.submissions.forms();
  const cat = useApi.sf.catalogue();
  const assets = useApi.sf.assets();
  const picklists = useApi.sf.picklists();
  const mine = useApi.submissions.mine();
  const submit = useApi.submissions.submit();
  const onSubmit = (def: { type: string }) =>
    submit.mutate(
      { type: def.type, values },
      {
        onSuccess: () => {
          utils.submissions.mine.invalidate();
          utils.sf.opportunities.invalidate();
        },
      },
    );

  const [type, setType] = useState('deal_registration');
  const [values, setValues] = useState<Record<string, string>>({});
  const [nl, setNl] = useState('');
  const [assistMsg, setAssistMsg] = useState<string | null>(null);
  const assist = useApi.assist.parse();
  const onAssist = () =>
    assist.mutate(
      { message: nl },
      {
        onSuccess: (r) => {
          if (!r.ok) {
            setAssistMsg(
              r.error === 'no_form_match'
                ? t(
                    'I couldn’t match that to a form — try naming the action (e.g. "register a deal").',
                  )
                : t('Assistant is temporarily unavailable.'),
            );
            return;
          }
          setType(r.formType);
          const stringified: Record<string, string> = {};
          for (const [k, v] of Object.entries(r.values)) stringified[k] = String(v ?? '');
          setValues(stringified);
          submit.reset();
          setAssistMsg(r.followUp);
        },
      },
    );

  const def = forms.data?.find((f) => f.type === type);

  const optionsFor = useMemo(
    () => (source?: string): { value: string; label: string }[] => {
      if (source === 'product')
        return (cat.data?.products ?? []).map((p) => ({ value: p.name, label: p.name }));
      if (source === 'region')
        return Object.keys(picklists.data?.countriesByRegion ?? {}).map((r) => ({
          value: r,
          label: r,
        }));
      if (source === 'asset')
        return (assets.data ?? [])
          .filter((a) => a.renewalEligible)
          .map((a) => ({ value: a.id, label: `${a.customerName} — ${a.product} (${a.sku})` }));
      return [];
    },
    [cat.data, picklists.data, assets.data],
  );

  const result = submit.data;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 >{t('Forms & Requests')}</h1>

        <div className="rounded-[var(--radius-card)] border border-ai-accent/30 bg-ai-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-small font-medium text-ai-accent">
            <Sparkles size={16} /> {t('Describe what you need — the assistant fills the form')}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (nl.trim().length > 2) onAssist();
            }}
          >
            <input
              value={nl}
              onChange={(e) => setNl(e.target.value)}
              placeholder={t('e.g. "Register a deal for Globex, OpenEdge, ~75k, contact Jane Doe"')}
              className="flex-1 rounded-[var(--radius-control)] border border-border px-3 py-2 text-body outline-none focus:border-border-focus"
            />
            <button
              type="submit"
              disabled={assist.isPending}
              className="rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white disabled:opacity-50"
            >
              {assist.isPending ? t('Thinking…') : t('Ask')}
            </button>
          </form>
          {assistMsg && <p className="mt-2 text-small text-text-primary">{assistMsg}</p>}
        </div>

        <div className="flex gap-2">
          {(forms.data ?? []).map((f) => (
            <button
              key={f.type}
              type="button"
              onClick={() => {
                setType(f.type);
                setValues({});
                submit.reset();
              }}
              className={`rounded-[var(--radius-control)] border px-3 py-1.5 text-small ${
                type === f.type
                  ? 'border-progress-blue bg-ai-surface text-ai-accent'
                  : 'border-border text-text-secondary'
              }`}
            >
              {t(f.title)}
            </button>
          ))}
        </div>

        {def && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(def);
            }}
            className="space-y-3 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
          >
            <h2 className="text-subhead font-semibold">{t(def.title)}</h2>
            {def.alwaysApprove && (
              <p className="rounded-[var(--radius-control)] bg-warning/10 px-3 py-1.5 text-caption text-warning">
                {t('Submissions of this type always go to Progress for review.')}
              </p>
            )}
            {def.fields.map((field) => {
              const opts = optionsFor(field.optionSource);
              return (
                <label key={field.name} className="block">
                  <span className="mb-1 block text-small font-medium">
                    {t(field.label)}
                    {field.required && <span className="text-danger"> *</span>}
                  </span>
                  {field.type === 'select' || field.optionSource ? (
                    <select
                      value={values[field.name] ?? ''}
                      onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                      className="w-full rounded-[var(--radius-control)] border border-border px-3 py-2 text-body"
                    >
                      <option value="">{t('Select…')}</option>
                      {(field.options ?? opts.map((o) => o.value)).map((o, i) => (
                        <option key={o} value={o}>
                          {opts[i]?.label ?? o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={values[field.name] ?? ''}
                      onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                      className="w-full rounded-[var(--radius-control)] border border-border px-3 py-2 text-body outline-none focus:border-border-focus"
                    />
                  )}
                </label>
              );
            })}
            <button
              type="submit"
              disabled={submit.isPending}
              className="rounded-[var(--radius-control)] bg-progress-blue px-4 py-2 text-small font-medium text-white disabled:opacity-50"
            >
              {submit.isPending ? t('Submitting…') : t('Submit')}
            </button>
            {submit.error && <p className="text-small text-danger">{submit.error.message}</p>}
          </form>
        )}

        {result && (
          <div
            className={`rounded-[var(--radius-card)] border p-4 ${
              result.status === 'auto_approved'
                ? 'border-success bg-success/10'
                : 'border-warning bg-warning/10'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {result.status === 'auto_approved' ? (
                <>
                  <CheckCircle2 size={16} className="text-success" /> {t('Submitted to Salesforce')}
                  {result.sfRecordId && (
                    <span className="font-mono text-caption text-text-secondary">
                      {result.sfRecordId}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Clock size={16} className="text-warning" /> {t('Routed for Progress review')}
                </>
              )}
            </div>
            {result.findings.length > 0 && (
              <ul className="mt-2 space-y-1 text-small">
                {result.findings.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />
                    <span>
                      <span className="font-medium capitalize">
                        {t(f.kind.replace(/_/g, ' '))}:
                      </span>{' '}
                      {f.detail}
                      {f.confidence != null && (
                        <span className="text-text-secondary">
                          {' '}
                          ({Math.round(f.confidence * 100)}% {t('confidence')})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-caption text-text-secondary">
              {t('Recommendation')}:{' '}
              <span className="font-medium">{result.recommendation}</span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-subhead font-semibold">{t('My Submissions')}</h2>
        {(mine.data ?? []).map((s) => (
          <div
            key={s.id}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-3 text-small"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">{t(s.type.replace(/_/g, ' '))}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-caption ${
                  s.status === 'approved' || s.status === 'auto_approved'
                    ? 'bg-success/10 text-success'
                    : s.status === 'rejected'
                      ? 'bg-danger/10 text-danger'
                      : 'bg-warning/10 text-warning'
                }`}
              >
                {t(s.status.replace(/_/g, ' '))}
              </span>
            </div>
            <p className="mt-1 text-caption text-text-secondary">{shortDate(s.createdAt)}</p>
          </div>
        ))}
        {(mine.data ?? []).length === 0 && (
          <p className="text-small text-text-secondary">{t('No submissions yet.')}</p>
        )}
      </div>
    </div>
  );
}
