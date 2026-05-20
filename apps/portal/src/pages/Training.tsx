import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';

export function Training() {
  const { t } = useI18n();
  const courses = useApi.portal.courses();
  return (
    <div className="space-y-4">
      <h1 className="text-page font-semibold">{t('Training & Certification')}</h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {(courses.data ?? []).map((c) => (
          <div
            key={c.id}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-subhead font-semibold">{c.title}</h2>
              <span className="text-caption text-text-secondary">
                {c.estimatedMinutes ?? '—'} {t('min')}
              </span>
            </div>
            {c.description && (
              <p className="mt-1 text-small text-text-secondary">{c.description}</p>
            )}
            <div className="mt-3 h-1.5 w-full rounded-full bg-surface-alt">
              <div className="h-full w-0 rounded-full bg-progress-green" />
            </div>
            <button
              type="button"
              className="mt-3 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-small hover:bg-surface-alt"
            >
              {t('Start course')}
            </button>
          </div>
        ))}
        {(courses.data ?? []).length === 0 && (
          <p className="text-small text-text-secondary">{t('No courses published yet.')}</p>
        )}
      </div>
    </div>
  );
}
