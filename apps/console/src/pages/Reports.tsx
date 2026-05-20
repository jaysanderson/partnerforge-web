import { useApi } from '../api/hooks';
import { money } from '../lib/format';

function Bars({ data }: { data: Record<string, { count: number; value: number }> }) {
  const max = Math.max(1, ...Object.values(data).map((v) => v.value));
  return (
    <div className="space-y-1.5">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex items-center gap-3">
          <span className="w-32 truncate text-small text-text-secondary">{k}</span>
          <div className="h-4 flex-1 rounded-[var(--radius-control)] bg-surface-alt">
            <div
              className="h-full rounded-[var(--radius-control)] bg-progress-blue"
              style={{ width: `${(v.value / max) * 100}%` }}
            />
          </div>
          <span className="w-24 text-right font-mono text-small">{money(v.value)}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-subhead font-semibold">{title}</h2>
      {children}
    </div>
  );
}

export function Reports() {
  const pipeline = useApi.reports.pipeline();
  const attribution = useApi.reports.revenueAttribution();
  const scorecard = useApi.reports.partnerScorecard();
  const health = useApi.reports.programHealth();

  return (
    <div className="space-y-6">
      <h1 >Reports</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Pipeline by Stage">
          {pipeline.data && <Bars data={pipeline.data.byStage} />}
        </Card>
        <Card title="Pipeline by Product">
          {pipeline.data && <Bars data={pipeline.data.byProduct} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Revenue Attribution">
          <dl className="space-y-2 text-small">
            <Row k="Partner-sourced (won)" v={money(attribution.data?.partnerSourced ?? 0)} />
            <Row k="Open pipeline" v={money(attribution.data?.openPipeline ?? 0)} />
            <Row k="Won deals" v={String(attribution.data?.wonCount ?? 0)} />
          </dl>
        </Card>
        <Card title="Program Health">
          <dl className="space-y-2 text-small">
            <Row k="Total partners" v={String(health.data?.totalPartners ?? 0)} />
            <Row k="Avg engagement" v={`${health.data?.avgEngagement ?? 0}/100`} />
            <Row
              k="Certifications"
              v={String(health.data?.certificationsCompleted ?? 0)}
            />
          </dl>
        </Card>
        <Card title="Partners by Tier">
          <dl className="space-y-2 text-small">
            {Object.entries(health.data?.byTier ?? {}).map(([t, n]) => (
              <Row key={t} k={t} v={String(n)} />
            ))}
          </dl>
        </Card>
      </div>

      <Card title="Partner Scorecard">
        <table className="w-full text-body">
          <thead>
            <tr className="bg-surface-alt text-left text-caption uppercase text-text-secondary">
              <th className="px-3 py-2">Partner</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2 text-right">Engagement</th>
              <th className="px-3 py-2 text-right">Open Pipeline</th>
              <th className="px-3 py-2 text-right">Closed Revenue</th>
            </tr>
          </thead>
          <tbody>
            {(scorecard.data ?? []).map((s) => (
              <tr key={s.partner} className="border-t border-border">
                <td className="px-3 py-2">{s.partner}</td>
                <td className="px-3 py-2">{s.tier}</td>
                <td className="px-3 py-2 text-right">{s.engagement}</td>
                <td className="px-3 py-2 text-right font-mono">{money(s.openPipeline)}</td>
                <td className="px-3 py-2 text-right font-mono">{money(s.closedRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-1">
      <dt className="text-text-secondary">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}
