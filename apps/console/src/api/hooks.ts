/**
 * `useApi` — react-query hooks that hit the REST surface at /v1/*.
 *
 * Each hook is a thin wrapper around fetch (via `apiGet` / `apiPost` / …),
 * typed end-to-end via tRPC's inferRouterInputs/Outputs on AppRouter. This
 * preserves IDE autocomplete + request/response inference today; when the
 * web splits to its own repo (PR9) we swap the AppRouter import for
 * `openapi-typescript` codegen of /docs/json — caller code stays unchanged.
 *
 * Method+path mapping mirrors apps/api/src/rest.ts. Path conventions:
 *   list / get      → GET /v1/{resource}        (+ querystring for filters)
 *   single by id    → GET /v1/{resource}/{id}
 *   create          → POST /v1/{resource}
 *   update          → PATCH /v1/{resource}/{id}
 *   admin actions   → POST /v1/{resource}/{action}
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@partnerforge/api';
import { apiGet, apiPost, apiPatch, apiPut } from './client';

type In = inferRouterInputs<AppRouter>;
type Out = inferRouterOutputs<AppRouter>;

// ── partners ────────────────────────────────────────────────────────────
export const partnersApi = {
  list: (input?: In['partners']['list']) =>
    useQuery({
      queryKey: ['partners.list', input],
      queryFn: () => apiGet<Out['partners']['list']>('/partners', input),
    }),
  get: (input: In['partners']['get']) =>
    useQuery({
      queryKey: ['partners.get', input.id],
      queryFn: () => apiGet<Out['partners']['get']>(`/partners/${input.id}`),
      enabled: !!input.id,
    }),
  getDetailed: (input: In['partners']['getDetailed']) =>
    useQuery({
      queryKey: ['partners.getDetailed', input.id],
      queryFn: () => apiGet<Out['partners']['getDetailed']>(`/partners/${input.id}`),
      enabled: !!input.id,
    }),
};

// ── deals (Opportunities) ───────────────────────────────────────────────
export const dealsApi = {
  list: (input?: In['deals']['list']) =>
    useQuery({
      queryKey: ['deals.list', input],
      queryFn: () =>
        apiGet<Out['deals']['list']>(
          '/deals',
          input
            ? {
                partner_id: input.partnerId,
                stage: input.stage,
                region: input.region,
                businessUnit: input.businessUnit,
                product: input.product,
              }
            : undefined,
        ),
    }),
  conflicts: () =>
    useQuery({
      queryKey: ['deals.conflicts'],
      queryFn: () => apiGet<Out['deals']['conflicts']>('/deals/conflicts'),
    }),
  update: () =>
    useMutation({
      mutationFn: ({ id, ...patch }: In['deals']['update']) =>
        apiPatch<Out['deals']['update']>(`/deals/${id}`, patch),
    }),
};

// ── content ─────────────────────────────────────────────────────────────
export const contentApi = {
  list: (input?: In['content']['list']) =>
    useQuery({
      queryKey: ['content.list', input],
      queryFn: () => apiGet<Out['content']['list']>('/content', input),
    }),
  publish: () =>
    useMutation({
      mutationFn: (input: In['content']['publish']) =>
        apiPost<Out['content']['publish']>('/content/publish', input),
    }),
};

// ── approvals ───────────────────────────────────────────────────────────
export const approvalsApi = {
  pending: () =>
    useQuery({
      queryKey: ['approvals.pending'],
      queryFn: () => apiGet<Out['approvals']['pending']>('/approvals/pending'),
    }),
  decide: () =>
    useMutation({
      mutationFn: (input: In['approvals']['decide']) =>
        apiPost<Out['approvals']['decide']>('/approvals/decide', input),
    }),
};

// ── audit ───────────────────────────────────────────────────────────────
export const auditApi = {
  list: (input?: In['audit']['list']) =>
    useQuery({
      queryKey: ['audit.list', input],
      queryFn: () => apiGet<Out['audit']['list']>('/audit', input),
    }),
};

// ── collaboration ───────────────────────────────────────────────────────
export const collaborationApi = {
  list: (input: In['collaboration']['list']) =>
    useQuery({
      queryKey: ['collaboration.list', input],
      queryFn: () => apiGet<Out['collaboration']['list']>('/collaboration', input),
      enabled: !!input.recordId,
    }),
  add: () =>
    useMutation({
      mutationFn: (input: In['collaboration']['add']) =>
        apiPost<Out['collaboration']['add']>('/collaboration', input),
    }),
};

// ── ai ──────────────────────────────────────────────────────────────────
export const aiApi = {
  search: (input: In['ai']['search']) =>
    useQuery({
      queryKey: ['ai.search', input],
      queryFn: () => apiPost<Out['ai']['search']>('/ai/search', input),
      enabled: !!input.query,
    }),
  ask: () =>
    useMutation({
      mutationFn: (input: In['ai']['ask']) =>
        apiPost<Out['ai']['ask']>('/ai/ask', input),
    }),
  insightsForPartner: (input: In['ai']['insightsForPartner']) =>
    useQuery({
      queryKey: ['ai.insightsForPartner', input.partnerId],
      queryFn: () =>
        apiGet<Out['ai']['insightsForPartner']>(`/ai/insights/${input.partnerId}`),
      enabled: !!input.partnerId,
    }),
  pipelineSummary: () =>
    useQuery({
      queryKey: ['ai.pipelineSummary'],
      queryFn: () => apiGet<Out['ai']['pipelineSummary']>('/ai/pipeline-summary'),
    }),
};

// ── reports ─────────────────────────────────────────────────────────────
export const reportsApi = {
  pipeline: () =>
    useQuery({
      queryKey: ['reports.pipeline'],
      queryFn: () => apiGet<Out['reports']['pipeline']>('/reports/pipeline'),
    }),
  revenueAttribution: () =>
    useQuery({
      queryKey: ['reports.revenueAttribution'],
      queryFn: () =>
        apiGet<Out['reports']['revenueAttribution']>('/reports/revenue-attribution'),
    }),
  partnerScorecard: () =>
    useQuery({
      queryKey: ['reports.partnerScorecard'],
      queryFn: () =>
        apiGet<Out['reports']['partnerScorecard']>('/reports/partner-scorecard'),
    }),
  programHealth: () =>
    useQuery({
      queryKey: ['reports.programHealth'],
      queryFn: () => apiGet<Out['reports']['programHealth']>('/reports/program-health'),
    }),
};

// ── system (admin orchestration: sync, intel, cache) ───────────────────
// The intel.* triggers don't have REST routes yet (only the cron + the
// system.syncRunAll wrap them), so the Operations page hits them via the
// existing tRPC URLs. Same handlers either way.
export const systemApi = {
  cacheStats: () =>
    useQuery({
      queryKey: ['system.cacheStats'],
      queryFn: () => apiGet<Out['system']['cacheStats']>('/system/cache-stats'),
      // Stats are admin-visible at all times; auto-refetch every 30s so the
      // freshness panel "ages" without manual reload.
      refetchInterval: 30_000,
    }),
  syncRunAll: () =>
    useMutation({
      mutationFn: () => apiPost<Out['system']['syncRunAll']>('/system/sync'),
    }),
  cacheRefresh: () =>
    useMutation({
      mutationFn: (input: In['system']['cacheRefresh']) =>
        apiPost<Out['system']['cacheRefresh']>('/system/cache-refresh', input),
    }),
};

// ── commissions / mdf / goals / tiers / journeys / training (Programs) ─
export const commissionsApi = {
  plans: () =>
    useQuery({
      queryKey: ['commissions.plans'],
      queryFn: () => apiGet<Out['commissions']['plans']>('/commissions/plans'),
    }),
  payouts: () =>
    useQuery({
      queryKey: ['commissions.payouts'],
      queryFn: () => apiGet<Out['commissions']['payouts']>('/commissions/payouts'),
    }),
  statements: () =>
    useQuery({
      queryKey: ['commissions.statements'],
      queryFn: () => apiGet<Out['commissions']['statements']>('/commissions/statements'),
    }),
  recompute: () =>
    useMutation({
      mutationFn: () =>
        apiPost<Out['commissions']['recompute']>('/commissions/recompute'),
    }),
};

export const mdfApi = {
  list: () =>
    useQuery({
      queryKey: ['mdf.list'],
      queryFn: () => apiGet<Out['mdf']['list']>('/mdf'),
    }),
};

export const goalsApi = {
  list: () =>
    useQuery({
      queryKey: ['goals.list'],
      queryFn: () => apiGet<Out['goals']['list']>('/goals'),
    }),
};

export const tiersApi = {
  list: () =>
    useQuery({
      queryKey: ['tiers.list'],
      queryFn: () => apiGet<Out['tiers']['list']>('/tiers'),
    }),
};

export const journeysApi = {
  list: () =>
    useQuery({
      queryKey: ['journeys.list'],
      queryFn: () => apiGet<Out['journeys']['list']>('/journeys'),
    }),
};

export const trainingApi = {
  courses: () =>
    useQuery({
      queryKey: ['training.courses'],
      queryFn: () => apiGet<Out['training']['courses']>('/training/courses'),
    }),
  certifications: () =>
    useQuery({
      queryKey: ['training.certifications'],
      queryFn: () =>
        apiGet<Out['training']['certifications']>('/training/certifications'),
    }),
};

// ── apiKeys (admin: service-account credentials) ───────────────────────
export const apiKeysApi = {
  list: () =>
    useQuery({
      queryKey: ['apiKeys.list'],
      queryFn: () => apiGet<Out['apiKeys']['list']>('/api-keys'),
    }),
  create: () =>
    useMutation({
      mutationFn: (input: In['apiKeys']['create']) =>
        apiPost<Out['apiKeys']['create']>('/api-keys', input),
    }),
  revoke: () =>
    useMutation({
      mutationFn: (input: In['apiKeys']['revoke']) =>
        apiPost<Out['apiKeys']['revoke']>(`/api-keys/${input.id}/revoke`),
    }),
};

// ── adminConfig ─────────────────────────────────────────────────────────
export const adminConfigApi = {
  mode: () =>
    useQuery({
      queryKey: ['adminConfig.mode'],
      queryFn: () => apiGet<Out['adminConfig']['mode']>('/admin-config/mode'),
    }),
  setMode: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: In['adminConfig']['setMode']) =>
        apiPost<Out['adminConfig']['setMode']>('/admin-config/mode', input),
      // After a mode flip every adapter-backed read (sf cache, ai, intel)
      // is conceptually stale. Bigger hammer than strictly needed, but the
      // alternative is enumerating every queryKey that depends on mode.
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['adminConfig.mode'] });
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceConfig'] });
      },
    });
  },
  salesforceConfig: () =>
    useQuery({
      queryKey: ['adminConfig.salesforceConfig'],
      queryFn: () =>
        apiGet<Out['adminConfig']['salesforceConfig']>('/admin-config/salesforce'),
    }),
  // ── Salesforce integration wizard ──────────────────────────────────────
  salesforceIntegration: () =>
    useQuery({
      queryKey: ['adminConfig.salesforceIntegration'],
      queryFn: () =>
        apiGet<Out['adminConfig']['salesforceIntegration']>(
          '/admin-config/salesforce/integration',
        ),
    }),
  salesforceConnectedApp: () =>
    useQuery({
      queryKey: ['adminConfig.salesforceConnectedApp'],
      queryFn: () =>
        apiGet<Out['adminConfig']['salesforceConnectedApp']>(
          '/admin-config/salesforce/connected-app',
        ),
    }),
  setSalesforceConnectedApp: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: In['adminConfig']['setSalesforceConnectedApp']) =>
        apiPut<Out['adminConfig']['setSalesforceConnectedApp']>(
          '/admin-config/salesforce/connected-app',
          input,
        ),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceConnectedApp'] }),
    });
  },
  salesforceOAuthStart: () =>
    useMutation({
      mutationFn: (input: In['adminConfig']['salesforceOAuthStart']) =>
        apiPost<Out['adminConfig']['salesforceOAuthStart']>(
          '/admin-config/salesforce/oauth/start',
          input,
        ),
    }),
  salesforceOAuthComplete: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: In['adminConfig']['salesforceOAuthComplete']) =>
        apiPost<Out['adminConfig']['salesforceOAuthComplete']>(
          '/admin-config/salesforce/oauth/complete',
          input,
        ),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceIntegration'] });
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceConfig'] });
      },
    });
  },
  salesforceDisconnect: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () =>
        apiPost<Out['adminConfig']['salesforceDisconnect']>('/admin-config/salesforce/disconnect'),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceIntegration'] }),
    });
  },
  salesforceDescribe: (object: 'account' | 'contact' | 'opportunity') =>
    useQuery({
      queryKey: ['adminConfig.salesforceDescribe', object],
      queryFn: () =>
        apiGet<Out['adminConfig']['salesforceDescribe']>('/admin-config/salesforce/describe', {
          object,
        }),
    }),
  patchSalesforceIntegration: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: In['adminConfig']['patchSalesforceIntegration']) =>
        apiPatch<Out['adminConfig']['patchSalesforceIntegration']>(
          '/admin-config/salesforce/integration',
          input,
        ),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceIntegration'] }),
    });
  },
  salesforcePreview: () =>
    useQuery({
      queryKey: ['adminConfig.salesforcePreview'],
      queryFn: () =>
        apiGet<Out['adminConfig']['salesforcePreview']>('/admin-config/salesforce/preview'),
    }),
  activateSalesforceIntegration: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () =>
        apiPost<Out['adminConfig']['activateSalesforceIntegration']>(
          '/admin-config/salesforce/activate',
        ),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceIntegration'] });
        qc.invalidateQueries({ queryKey: ['system.cacheStats'] });
      },
    });
  },
  resetToDemoData: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: () =>
        apiPost<Out['adminConfig']['resetToDemoData']>('/admin-config/salesforce/reset-demo'),
      onSuccess: () => qc.invalidateQueries(),
    });
  },
  setUseMockInLive: () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: In['adminConfig']['setUseMockInLive']) =>
        apiPut<Out['adminConfig']['setUseMockInLive']>(
          '/admin-config/use-mock-in-live',
          input,
        ),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['adminConfig.mode'] });
        qc.invalidateQueries({ queryKey: ['adminConfig.salesforceConfig'] });
      },
    });
  },
  testSalesforceConnection: () =>
    useMutation({
      mutationFn: () =>
        apiPost<Out['adminConfig']['testSalesforceConnection']>(
          '/admin-config/test-salesforce',
        ),
    }),
  oppFieldOverrides: () =>
    useQuery({
      queryKey: ['adminConfig.oppFieldOverrides'],
      queryFn: () =>
        apiGet<Out['adminConfig']['oppFieldOverrides']>(
          '/admin-config/opp-field-overrides',
        ),
    }),
  setOppFieldOverrides: () =>
    useMutation({
      mutationFn: (input: In['adminConfig']['setOppFieldOverrides']) =>
        apiPut<Out['adminConfig']['setOppFieldOverrides']>(
          '/admin-config/opp-field-overrides',
          input,
        ),
    }),
  sharepointAssets: () =>
    useQuery({
      queryKey: ['adminConfig.sharepointAssets'],
      queryFn: () =>
        apiGet<Out['adminConfig']['sharepointAssets']>(
          '/admin-config/sharepoint-assets',
        ),
    }),
  setSharepointAssets: () =>
    useMutation({
      mutationFn: (input: In['adminConfig']['setSharepointAssets']) =>
        apiPut<Out['adminConfig']['setSharepointAssets']>(
          '/admin-config/sharepoint-assets',
          input,
        ),
    }),
};

/**
 * The `useApi.*` shape mirrors the old `trpc.*` namespace at the call site,
 * so file diffs are minimal: `trpc.partners.list.useQuery(x)` becomes
 * `useApi.partners.list(x)`. Mutations: `trpc.foo.bar.useMutation()` →
 * `useApi.foo.bar()` (returns a useMutation result).
 */
export const useApi = {
  partners: partnersApi,
  deals: dealsApi,
  content: contentApi,
  approvals: approvalsApi,
  audit: auditApi,
  collaboration: collaborationApi,
  ai: aiApi,
  reports: reportsApi,
  adminConfig: adminConfigApi,
  system: systemApi,
  apiKeys: apiKeysApi,
  commissions: commissionsApi,
  mdf: mdfApi,
  goals: goalsApi,
  tiers: tiersApi,
  journeys: journeysApi,
  training: trainingApi,
};

/**
 * Cache-invalidation shim that replaces `trpc.useUtils()`. Same shape: each
 * leaf has an `invalidate()` method that the caller fires after a mutation.
 */
export function useApiUtils() {
  const qc = useQueryClient();
  const inv = (key: readonly unknown[]) => () =>
    qc.invalidateQueries({ queryKey: key });
  return {
    partners: {
      list: { invalidate: inv(['partners.list']) },
      get: { invalidate: inv(['partners.get']) },
      getDetailed: { invalidate: inv(['partners.getDetailed']) },
    },
    deals: {
      list: { invalidate: inv(['deals.list']) },
      conflicts: { invalidate: inv(['deals.conflicts']) },
    },
    content: { list: { invalidate: inv(['content.list']) } },
    approvals: { pending: { invalidate: inv(['approvals.pending']) } },
    audit: { list: { invalidate: inv(['audit.list']) } },
    adminConfig: {
      mode: { invalidate: inv(['adminConfig.mode']) },
      salesforceConfig: { invalidate: inv(['adminConfig.salesforceConfig']) },
      oppFieldOverrides: { invalidate: inv(['adminConfig.oppFieldOverrides']) },
      sharepointAssets: { invalidate: inv(['adminConfig.sharepointAssets']) },
    },
    system: { cacheStats: { invalidate: inv(['system.cacheStats']) } },
    apiKeys: { list: { invalidate: inv(['apiKeys.list']) } },
  };
}
