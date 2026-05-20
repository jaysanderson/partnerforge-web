/**
 * REST client used by the console. Replaces the tRPC client — every page
 * now consumes the documented `/v1/*` surface (the same one customers see
 * at /docs).
 *
 * Auth: a JWT from dev-login goes in `localStorage.pf.console.token` and
 * rides on every request as `Authorization: Bearer ...`. (For service
 * integrations we'd use `X-Api-Key` — see PR1 — but the browser session
 * uses a real user JWT.)
 *
 * Type-safety: hooks (`useApi`) keep request/response types via tRPC's
 * `inferRouterInputs` / `inferRouterOutputs` on the AppRouter — purely as
 * a type-level dependency, no runtime tRPC code on the wire. When the web
 * splits into its own repo (PR9), we swap that for `openapi-typescript`
 * codegen against /docs/json.
 */

const API_BASE = '/v1';
const TOKEN_KEY = 'pf.console.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { authorization: `Bearer ${t}` } : {};
}

/**
 * When the server rejects our JWT (401), the session in localStorage is
 * stale — token expired, or signed under a JWT_SECRET that's since rotated.
 * Clear both keys and reload so the user lands on <Login /> rather than
 * sitting on a hollow dashboard with every query silently failing and the
 * mutation toast as the only visible error.
 *
 * Re-entrancy guard: many queries 401 in parallel. Only the first triggers
 * the reload; the rest land on the login page after the reload anyway.
 */
const USER_KEY = 'pf.console.user';
let sessionClearedOnce = false;
function clearStaleSessionAndReload(): void {
  if (sessionClearedOnce) return;
  sessionClearedOnce = true;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* localStorage might be disabled */
  }
  // Use a soft delay so any in-flight promise that's about to surface the
  // 401 error sees the reload kick in first (avoids a flicker of an error
  // toast as the page reloads).
  if (typeof window !== 'undefined') {
    setTimeout(() => window.location.reload(), 50);
  }
}

async function parseError(res: Response): Promise<ApiError> {
  let code = 'INTERNAL_SERVER_ERROR';
  let message = `${res.status} ${res.statusText}`;
  try {
    const body = (await res.json()) as { code?: string; message?: string };
    if (body.code) code = body.code;
    if (body.message) message = body.message;
  } catch {
    /* not JSON */
  }
  // 401 + a token in localStorage means the token is stale. Clear + reload.
  // 401 + no token means we're already signed out — let the error propagate.
  if (res.status === 401 && getToken()) {
    clearStaleSessionAndReload();
  }
  return new ApiError(res.status, code, message);
}

function qs(input: unknown): string {
  if (!input || typeof input !== 'object') return '';
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (v === undefined || v === null || v === '') continue;
    params.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function apiGet<T>(path: string, params?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}${qs(params)}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}

export async function apiSend<T>(
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...authHeader() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}

export const apiPost = <T>(path: string, body?: unknown) => apiSend<T>('POST', path, body);
export const apiPatch = <T>(path: string, body?: unknown) => apiSend<T>('PATCH', path, body);
export const apiPut = <T>(path: string, body?: unknown) => apiSend<T>('PUT', path, body);
