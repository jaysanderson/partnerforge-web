/**
 * `useApi` for the partner portal. Mirrors the tRPC shape so callsite diffs
 * are tiny: `trpc.portal.dashboard.useQuery()` → `useApi.portal.dashboard()`.
 *
 * Method/path mapping mirrors apps/api/src/rest.ts. Type-safety via tRPC
 * AppRouter inference today; swap for openapi-typescript codegen at the
 * repo split (PR9).
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@partnerforge/api';
import { apiGet, apiPost } from './client';

type In = inferRouterInputs<AppRouter>;
type Out = inferRouterOutputs<AppRouter>;

// ── adminConfig (public for mode badge + asset surface) ────────────────
const adminConfigApi = {
  mode: () =>
    useQuery({
      queryKey: ['adminConfig.mode'],
      queryFn: () => apiGet<Out['adminConfig']['mode']>('/admin-config/mode'),
    }),
  sharepointAssets: () =>
    useQuery({
      queryKey: ['adminConfig.sharepointAssets'],
      queryFn: () =>
        apiGet<Out['adminConfig']['sharepointAssets']>(
          '/admin-config/sharepoint-assets',
        ),
    }),
};

// ── portal (partner-scoped reads) ──────────────────────────────────────
const portalApi = {
  me: () =>
    useQuery({
      queryKey: ['portal.me'],
      queryFn: () => apiGet<Out['portal']['me']>('/portal/me'),
    }),
  dashboard: () =>
    useQuery({
      queryKey: ['portal.dashboard'],
      queryFn: () => apiGet<Out['portal']['dashboard']>('/portal/dashboard'),
    }),
  content: () =>
    useQuery({
      queryKey: ['portal.content'],
      queryFn: () => apiGet<Out['portal']['content']>('/portal/content'),
    }),
  courses: () =>
    useQuery({
      queryKey: ['portal.courses'],
      queryFn: () => apiGet<Out['portal']['courses']>('/portal/courses'),
    }),
  searchContent: (input: In['portal']['searchContent']) =>
    useQuery({
      queryKey: ['portal.searchContent', input],
      queryFn: () =>
        apiGet<Out['portal']['searchContent']>('/portal/search', input),
      enabled: !!input.query,
    }),
  // Suggested-question chips for the AI Assistant. Backend regenerates at
  // most every 24h; keep the client copy hot for the same window so the
  // chips don't re-fetch on every nav back to /assistant.
  agentSuggestions: () =>
    useQuery({
      queryKey: ['portal.agentSuggestions'],
      queryFn: () =>
        apiGet<Out['portal']['agentSuggestions']>('/portal/agent/suggestions'),
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
  // ── Video Library (TubeRAG) ──────────────────────────────────────────
  videoGet: (input: In['portal']['videoGet']) =>
    useQuery({
      queryKey: ['portal.videoGet', input.id],
      queryFn: () => apiGet<Out['portal']['videoGet']>(`/portal/videos/${input.id}`),
      enabled: !!input.id,
    }),
  videoTranscript: (input: In['portal']['videoTranscript']) =>
    useQuery({
      queryKey: ['portal.videoTranscript', input.id],
      queryFn: () =>
        apiGet<Out['portal']['videoTranscript']>(`/portal/videos/${input.id}/transcript`),
      enabled: !!input.id,
    }),
  videoUpNext: (input: In['portal']['videoUpNext']) =>
    useQuery({
      queryKey: ['portal.videoUpNext', input.id],
      queryFn: () =>
        apiGet<Out['portal']['videoUpNext']>(`/portal/videos/${input.id}/up-next`),
      enabled: !!input.id,
    }),
  videoAsk: () =>
    useMutation({
      mutationFn: (input: In['portal']['videoAsk']) =>
        apiPost<Out['portal']['videoAsk']>(`/portal/videos/${input.id}/ask`, {
          query: input.query,
          context: input.context,
        }),
    }),
};

// ── sf (partner-scoped views of Salesforce) ────────────────────────────
const sfApi = {
  account: () =>
    useQuery({
      queryKey: ['sf.account'],
      queryFn: () => apiGet<Out['sf']['account']>('/sf/account'),
    }),
  fieldMeta: () =>
    useQuery({
      queryKey: ['sf.fieldMeta'],
      queryFn: () => apiGet<Out['sf']['fieldMeta']>('/sf/field-meta'),
    }),
  opportunities: (input?: In['sf']['opportunities']) =>
    useQuery({
      queryKey: ['sf.opportunities', input],
      queryFn: () => apiGet<Out['sf']['opportunities']>('/sf/opportunities', input),
    }),
  opportunity: (input: In['sf']['opportunity']) =>
    useQuery({
      queryKey: ['sf.opportunity', input.id],
      queryFn: () => apiGet<Out['sf']['opportunity']>(`/sf/opportunities/${input.id}`),
      enabled: !!input.id,
    }),
  assets: () =>
    useQuery({
      queryKey: ['sf.assets'],
      queryFn: () => apiGet<Out['sf']['assets']>('/sf/assets'),
    }),
  quotes: () =>
    useQuery({
      queryKey: ['sf.quotes'],
      queryFn: () => apiGet<Out['sf']['quotes']>('/sf/quotes'),
    }),
  catalogue: () =>
    useQuery({
      queryKey: ['sf.catalogue'],
      queryFn: () => apiGet<Out['sf']['catalogue']>('/sf/catalogue'),
    }),
  picklists: () =>
    useQuery({
      queryKey: ['sf.picklists'],
      queryFn: () => apiGet<Out['sf']['picklists']>('/sf/picklists'),
    }),
  createRenewal: () =>
    useMutation({
      mutationFn: (input: In['sf']['createRenewal']) =>
        apiPost<Out['sf']['createRenewal']>('/sf/renewals', input),
    }),
};

// ── submissions (forms the partner can submit) ─────────────────────────
const submissionsApi = {
  forms: () =>
    useQuery({
      queryKey: ['submissions.forms'],
      queryFn: () => apiGet<Out['submissions']['forms']>('/submissions/forms'),
    }),
  mine: () =>
    useQuery({
      queryKey: ['submissions.mine'],
      queryFn: () => apiGet<Out['submissions']['mine']>('/submissions/mine'),
    }),
  submit: () =>
    useMutation({
      mutationFn: (input: In['submissions']['submit']) =>
        apiPost<Out['submissions']['submit']>('/submissions', input),
    }),
};

// ── assist (NL → form values) ──────────────────────────────────────────
const assistApi = {
  parse: () =>
    useMutation({
      mutationFn: (input: In['assist']['parse']) =>
        apiPost<Out['assist']['parse']>('/assist/parse', input),
    }),
};

// ── collaboration (per-record threads) ─────────────────────────────────
const collaborationApi = {
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

// ── deals (partner-scoped via sf, but the portal also has a portal.deals
//          alias today via tRPC — REST equivalent is /v1/sf/opportunities) ─
const dealsApi = {
  list: () =>
    useQuery({
      queryKey: ['portal.deals'],
      queryFn: () => apiGet<Out['portal']['dashboard']['recentDeals']>('/portal/dashboard').then((d) => d as unknown),
    }),
};

// ── partners (the portal can fetch its own partner record) ─────────────
const partnersApi = {
  get: (input: In['partners']['get']) =>
    useQuery({
      queryKey: ['partners.get', input.id],
      queryFn: () => apiGet<Out['partners']['get']>(`/partners/${input.id}`),
      enabled: !!input.id,
    }),
};

// ── i18n (translation pipeline, used by the locale switcher) ───────────
const i18nApi = {
  translate: () =>
    useMutation({
      mutationFn: (input: In['i18n']['translate']) =>
        apiPost<Out['i18n']['translate']>('/i18n/translate', input),
    }),
};

export const useApi = {
  adminConfig: adminConfigApi,
  portal: portalApi,
  sf: sfApi,
  submissions: submissionsApi,
  assist: assistApi,
  collaboration: collaborationApi,
  deals: dealsApi,
  partners: partnersApi,
  i18n: i18nApi,
};

/** Cache-invalidation shim. */
export function useApiUtils() {
  const qc = useQueryClient();
  const inv = (key: readonly unknown[]) => () =>
    qc.invalidateQueries({ queryKey: key });
  return {
    portal: {
      content: { invalidate: inv(['portal.content']) },
      courses: { invalidate: inv(['portal.courses']) },
      dashboard: { invalidate: inv(['portal.dashboard']) },
      deals: { invalidate: inv(['portal.deals']) },
    },
    sf: {
      account: { invalidate: inv(['sf.account']) },
      opportunities: { invalidate: inv(['sf.opportunities']) },
      opportunity: { invalidate: inv(['sf.opportunity']) },
      assets: { invalidate: inv(['sf.assets']) },
      quotes: { invalidate: inv(['sf.quotes']) },
    },
    submissions: {
      mine: { invalidate: inv(['submissions.mine']) },
    },
    collaboration: {
      list: { invalidate: inv(['collaboration.list']) },
    },
  };
}
