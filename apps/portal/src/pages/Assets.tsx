import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@partnerforge/ui';
import { useI18n } from '../i18n';
import { useApi, useApiUtils } from '../api/hooks';
import { shortDate } from '../lib';

export function Assets() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const utils = useApiUtils();
  const assets = useApi.sf.assets();
  const renew = useApi.sf.createRenewal();
  const onRenew = (assetId: string) =>
    renew.mutate(
      { assetId },
      {
        onSuccess: (r) => {
          utils.sf.opportunities.invalidate();
          navigate(`/opportunities/${r.id}`);
        },
      },
    );

  return (
    <div className="space-y-4">
      <h1 >{t('Assets & Renewals')}</h1>
      <p className="text-small text-text-secondary">
        {t(
          'Licenses assigned to your account. Renewal-eligible records can be converted to a renewal opportunity — the link to the original license is preserved.',
        )}
      </p>
      <table className="w-full rounded-[var(--radius-card)] border border-border bg-surface text-body">
        <thead>
          <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
            <th className="px-4 py-2">{t('Customer')}</th>
            <th className="px-4 py-2">{t('Product')}</th>
            <th className="px-4 py-2">{t('SKU')}</th>
            <th className="px-4 py-2 text-right">{t('Qty')}</th>
            <th className="px-4 py-2">{t('Ends')}</th>
            <th className="px-4 py-2">{t('Status')}</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {(assets.data ?? []).map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="px-4 py-2.5">{a.customerName}</td>
              <td className="px-4 py-2.5">{a.product}</td>
              <td className="px-4 py-2.5 font-mono text-small">{a.sku}</td>
              <td className="px-4 py-2.5 text-right">{a.quantity}</td>
              <td className="px-4 py-2.5 text-text-secondary">{shortDate(a.endDate)}</td>
              <td className="px-4 py-2.5">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-4 py-2.5 text-right">
                {a.renewalEligible ? (
                  <button
                    type="button"
                    disabled={renew.isPending}
                    onClick={() => onRenew(a.id)}
                    className="rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-caption font-medium text-white disabled:opacity-50"
                  >
                    {t('Create Renewal')}
                  </button>
                ) : (
                  <span className="text-caption text-text-secondary">—</span>
                )}
              </td>
            </tr>
          ))}
          {(assets.data ?? []).length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-small text-text-secondary">
                {t('No assets.')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
