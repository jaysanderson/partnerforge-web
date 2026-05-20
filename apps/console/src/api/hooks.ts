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
          input ? { partner_id: input.partnerId, stage: input.stage } : undefined,
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

// ── adminConfig ─────────────────────────────────────────────────────────
export const adminConfigApi = {
  mode: () =>
    useQuery({
      queryKey: ['adminConfig.mode'],
      queryFn: () => apiGet<Out['adminConfig']['mode']>('/admin-config/mode'),
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
      oppFieldOverrides: { invalidate: inv(['adminConfig.oppFieldOverrides']) },
      sharepointAssets: { invalidate: inv(['adminConfig.sharepointAssets']) },
    },
  };
}
