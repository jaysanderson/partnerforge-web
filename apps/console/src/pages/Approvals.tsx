import { AlertTriangle } from 'lucide-react';
import { useApi, useApiUtils } from '../api/hooks';
import { shortDate } from '../lib/format';

export function Approvals() {
  const utils = useApiUtils();
  const pending = useApi.approvals.pending();
  const decide = useApi.approvals.decide();
  const onDecide = (id: string, decision: 'approve' | 'reject') =>
    decide.mutate({ id, decision }, { onSuccess: () => utils.approvals.pending.invalidate() });

  if (pending.error) {
    return (
      <div className="space-y-2">
        <h1 className="text-page font-semibold">Submission Centre</h1>
        <p className="text-small text-danger">{pending.error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-page font-semibold">Submission Centre</h1>
        <p className="text-small text-text-secondary">
          Partner submissions routed for review — duplicate, channel-conflict, and
          account-creation governance.
        </p>
      </div>

      {(pending.data ?? []).map((s) => (
        <div
          key={s.id}
          className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="font-heading font-semibold capitalize">
                {s.type.replace(/_/g, ' ')}
              </span>
              <span className="ml-2 text-caption text-text-secondary">
                {s.accountId} · {shortDate(s.createdAt)}
              </span>
            </div>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-caption text-warning">
              {s.recommendation ?? 'review'}
            </span>
          </div>

          <pre className="mt-2 overflow-x-auto rounded-[var(--radius-control)] bg-surface-alt p-3 text-caption">
            {JSON.stringify(s.payload, null, 2)}
          </pre>

          {s.findings.length > 0 && (
            <ul className="mt-2 space-y-1 text-small">
              {s.findings.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />
                  <span>
                    <span className="font-medium capitalize">
                      {f.kind.replace(/_/g, ' ')}:
                    </span>{' '}
                    {f.detail}
                    {f.confidence != null && (
                      <span className="text-text-secondary">
                        {' '}
                        ({Math.round(f.confidence * 100)}%)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={decide.isPending}
              onClick={() => onDecide(s.id, 'approve')}
              className="rounded-[var(--radius-control)] bg-success px-4 py-1.5 text-small font-medium text-white disabled:opacity-50"
            >
              Approve &amp; push to Salesforce
            </button>
            <button
              type="button"
              disabled={decide.isPending}
              onClick={() => onDecide(s.id, 'reject')}
              className="rounded-[var(--radius-control)] border border-danger px-4 py-1.5 text-small font-medium text-danger disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
      {(pending.data ?? []).length === 0 && (
        <p className="text-small text-text-secondary">No submissions awaiting review.</p>
      )}
    </div>
  );
}
