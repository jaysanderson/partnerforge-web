import { useI18n } from '../i18n';
import { useApi } from '../api/hooks';
import { money, shortDate } from '../lib';

export function Quotes() {
  const { t } = useI18n();
  const quotes = useApi.sf.quotes();
  return (
    <div className="space-y-4">
      <h1 className="text-page font-semibold">{t('Quotes & Commercial Documents')}</h1>
      <table className="w-full rounded-[var(--radius-card)] border border-border bg-surface text-body">
        <thead>
          <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
            <th className="px-4 py-2">{t('File')}</th>
            <th className="px-4 py-2">{t('Type')}</th>
            <th className="px-4 py-2">{t('Linked to')}</th>
            <th className="px-4 py-2 text-right">{t('Amount')}</th>
            <th className="px-4 py-2">{t('Created')}</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {(quotes.data ?? []).map((q) => (
            <tr key={q.id} className="border-t border-border">
              <td className="px-4 py-2.5">{q.fileName}</td>
              <td className="px-4 py-2.5 capitalize">{q.type}</td>
              <td className="px-4 py-2.5 text-text-secondary">
                {q.relatedTo.type} · {q.relatedTo.id}
              </td>
              <td className="px-4 py-2.5 text-right font-mono">{money(q.amount, q.currency)}</td>
              <td className="px-4 py-2.5 text-text-secondary">{shortDate(q.createdAt)}</td>
              <td className="px-4 py-2.5 text-right">
                <a
                  href={q.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-progress-blue hover:underline"
                >
                  {t('Download')}
                </a>
              </td>
            </tr>
          ))}
          {(quotes.data ?? []).length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-small text-text-secondary">
                {t('No quotes available.')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
