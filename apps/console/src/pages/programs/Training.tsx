/**
 * Courses & Certificates — admin view.
 *
 * Two tables: every published-or-draft training course, and the ledger
 * of certifications earned by partner contacts.
 */
import { useState, type ReactElement } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { EmptyState } from '@partnerforge/ui';
import { useApi } from '../../api/hooks';

const shortDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString() : '—';

const STATUS_TONE: Record<string, string> = {
  completed: 'bg-success/10 text-success',
  in_progress: 'bg-warning/10 text-warning',
  expired: 'bg-danger/10 text-danger',
  cancelled: 'bg-surface-alt text-text-secondary',
};

export function Training(): ReactElement {
  const courses = useApi.training.courses();
  const certifications = useApi.training.certifications();
  const [tab, setTab] = useState<'courses' | 'certs'>('courses');

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          Programs
        </div>
        <h1 className="font-heading text-h1 font-semibold">Courses &amp; Certificates</h1>
        <p className="mt-1 max-w-2xl text-body text-text-secondary">
          The training catalogue partners see in their portal, plus the
          ledger of certifications they&apos;ve earned. The portal&apos;s
          Training tab reads the same data — this is the admin view that
          includes drafts.
        </p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {([
          ['courses', 'Courses'],
          ['certs', 'Certifications'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`px-4 py-2 text-small ${
              tab === k
                ? 'border-b-2 border-progress-blue font-medium text-text-primary'
                : 'text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          {(courses.data ?? []).length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={GraduationCap}
              title="No courses published yet"
              body="Once the training team publishes courses, partners will see them in the portal's Training tab. Drafts and published courses both appear here."
              compact
            />
          ) : (
            <table className="w-full text-body">
              <thead>
                <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Modules</th>
                  <th className="px-3 py-2 text-right">Est. minutes</th>
                </tr>
              </thead>
              <tbody>
                {(courses.data ?? []).map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap size={14} className="text-progress-blue" />
                        {c.title}
                      </span>
                      {c.description && (
                        <div className="text-caption text-text-secondary">{c.description}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 capitalize">{c.status}</td>
                    <td className="px-3 py-2 text-right">{c.modules.length}</td>
                    <td className="px-3 py-2 text-right">{c.estimatedMinutes ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {tab === 'certs' && (
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
          {(certifications.data ?? []).length === 0 ? (
            <EmptyState
              variant="zero-data"
              icon={Award}
              title="No certifications earned yet"
              body="As partner contacts complete courses, their certificates show up here with completion date, score, and status."
              compact
            />
          ) : (
            <table className="w-full text-body">
              <thead>
                <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
                  <th className="px-3 py-2">Partner</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Course</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Score</th>
                  <th className="px-3 py-2">Completed</th>
                </tr>
              </thead>
              <tbody>
                {(certifications.data ?? []).map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{c.partnerName ?? '—'}</td>
                    <td className="px-3 py-2">{c.contactName ?? '—'}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Award size={12} className="text-warning" />
                        {c.courseTitle ?? c.courseId}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-caption capitalize ${STATUS_TONE[c.status] ?? 'bg-surface-alt'}`}
                      >
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono">{c.score ?? '—'}</td>
                    <td className="px-3 py-2 text-caption text-text-secondary">
                      {shortDate(c.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
