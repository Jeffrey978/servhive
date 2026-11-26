import { useAuth } from '@clerk/expo';
import { createContext, useContext, type ReactNode } from 'react';

import { useMe } from '@/lib/api';
import type { Me } from '@/lib/types';

/**
 * Who is using the app, resolved once at the root: Clerk says whether there is
 * a session, the website's /me says the role and whether set-up is done (the
 * role always comes from Servhive's database, never from the phone).
 */
export type Session = {
  status: 'loading' | 'signed-out' | 'error' | 'ready';
  me: Me | null;
  error: unknown;
  retry: () => void;
};

const Ctx = createContext<Session>({ status: 'loading', me: null, error: null, retry: () => {} });

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const me = useMe(!!isSignedIn);
  let status: Session['status'] = 'loading';
  if (isLoaded && !isSignedIn) status = 'signed-out';
  else if (isLoaded && isSignedIn && me.data) status = 'ready';
  else if (isLoaded && isSignedIn && me.error) status = 'error';
  return <Ctx.Provider value={{ status, me: me.data ?? null, error: me.error, retry: () => me.refetch() }}>{children}</Ctx.Provider>;
}

export const useSession = () => useContext(Ctx);

/** Where a session belongs: the route the app's index redirects to. */
export function homeFor(s: Session) {
  if (s.status === 'signed-out') return '/welcome' as const;
  const u = s.me?.user;
  if (!u) return '/welcome' as const;
  if (!u.onboarded) return '/onboarding' as const;
  if (u.role === 'ARTISAN') return '/pro' as const;
  if (u.role === 'ADMIN') return '/admin' as const;
  return '/client' as const;
}
