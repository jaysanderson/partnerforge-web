/**
 * REST client used by the partner portal. See the matching console module
 * for the full rationale (apps/console/src/api/client.ts) — same shape,
 * different token key.
 *
 * Auth: a partner JWT from magic-link or dev-login rides as
 * `Authorization: Bearer ...`. Partner principals are row-level-scoped at
 * the API; the portal can only see its own partner's data.
 */

const API_BASE = '/v1';
const TOKEN_KEY = 'pf.portal.token';

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

/** See apps/console/src/api/client.ts for the rationale. Mirror logic so
 *  partner sessions self-recover from a stale JWT the same way. */
const CONTACT_KEY = 'pf.portal.contact';
let sessionClearedOnce = false;
function clearStaleSessionAndReload(): void {
  if (sessionClearedOnce) return;
  sessionClearedOnce = true;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CONTACT_KEY);
  } catch {
    /* localStorage might be disabled */
  }
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
