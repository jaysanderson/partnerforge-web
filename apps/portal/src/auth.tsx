import { createContext, useContext, useState, type ReactNode } from 'react';
import { clearToken, setToken } from './api/client';

interface PortalContact {
  id: string;
  name: string;
  partnerId: string;
}

interface AuthCtx {
  contact: PortalContact | null;
  /** Dev magic-link: request → auto-verify (prod emails the link). */
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = 'pf.portal.contact';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('request failed');
  const json = (await res.json()) as { result: { data: T } };
  return json.result.data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<PortalContact | null>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PortalContact) : null;
  });

  const signIn = async (email: string): Promise<void> => {
    const req = await post<{ sent: boolean; devMagicToken?: string }>(
      '/trpc/auth.magicLinkRequest',
      { email },
    );
    if (!req.devMagicToken) {
      // Production path: the link was emailed. Nothing to chain in the UI.
      throw new Error('A sign-in link has been emailed to you.');
    }
    const verified = await post<{ token: string; contact: PortalContact }>(
      '/trpc/auth.magicLinkVerify',
      { magicToken: req.devMagicToken },
    );
    setToken(verified.token);
    localStorage.setItem(KEY, JSON.stringify(verified.contact));
    setContact(verified.contact);
  };

  const signOut = (): void => {
    clearToken();
    localStorage.removeItem(KEY);
    setContact(null);
  };

  return <Ctx.Provider value={{ contact, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
}
