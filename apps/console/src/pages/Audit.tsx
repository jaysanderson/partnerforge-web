import { useApi } from '../api/hooks';
import { shortDate } from '../lib/format';

export function Audit() {
  const audit = useApi.audit.list({ limit: 200 });

  if (audit.error) {
    return (
      <div className="space-y-2">
        <h1 >Audit Log</h1>
        <p className="text-small text-danger">
          {audit.error.message} — audit log is admin-only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 >Audit Log</h1>
      <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Entity</th>
            </tr>
          </thead>
          <tbody>
            {(audit.data ?? []).map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-2 text-text-secondary">{shortDate(a.createdAt)}</td>
                <td className="px-4 py-2">{a.userId ?? '—'}</td>
                <td className="px-4 py-2">{a.userRole ?? '—'}</td>
                <td className="px-4 py-2 capitalize">{a.action}</td>
                <td className="px-4 py-2">
                  {a.entityType} <span className="text-text-secondary">{a.entityId}</span>
                </td>
              </tr>
            ))}
            {(audit.data ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-small text-text-secondary">
                  No audit entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
