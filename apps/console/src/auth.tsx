import { createContext, useContext, useState, type ReactNode } from 'react';
import { clearToken, setToken } from './api/client';

export interface ConsoleUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthCtx {
  user: ConsoleUser | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const USER_KEY = 'pf.console.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ConsoleUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ConsoleUser) : null;
  });

  const login = async (email: string): Promise<void> => {
    const res = await fetch('/trpc/auth.devLogin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Login failed');
    const json = (await res.json()) as { result: { data: { token: string; user: ConsoleUser } } };
    setToken(json.result.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(json.result.data.user));
    setUser(json.result.data.user);
  };

  const logout = (): void => {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside AuthProvider');
  return c;
}
