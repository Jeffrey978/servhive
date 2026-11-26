import { useAuth } from '@clerk/expo';
import { focusManager, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { useApiFetch } from '@/lib/api';
import { pushState, registerForPush, resetPush, routeFor } from '@/lib/push';
import { useSession } from '@/lib/session';

/**
 * Wires pushes into the app once someone is signed in:
 * - registers this phone with the website,
 * - refreshes the affected data the moment a push arrives (a new message
 *   appears in an open conversation without polling),
 * - opens the right screen when a notification is tapped, including on cold start,
 * - refreshes data whenever the app comes back to the foreground.
 */
export function PushProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const qc = useQueryClient();
  const apiFetch = useApiFetch();
  const ready = session.status === 'ready' && !!session.me?.user.onboarded;
  const handled = useRef<string | null>(null);
  const lastResponse = Notifications.useLastNotificationResponse();

  // React Query's "window focus" on a phone = the app returning to the foreground.
  useEffect(() => {
    focusManager.setEventListener((setFocused) => {
      const sub = AppState.addEventListener('change', (s) => setFocused(s === 'active'));
      return () => sub.remove();
    });
  }, []);

  // Register this phone for pushes once the user is set up.
  useEffect(() => {
    if (!ready) return;
    registerForPush(async (token, platform) => {
      await apiFetch('/push-token', { method: 'POST', body: JSON.stringify({ token, platform }) });
    });
  }, [ready, apiFetch]);

  // A push arrived while the app is open: refresh what it's about.
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((n) => {
      const data = n.request.content.data as { type?: string; conversationId?: string } | undefined;
      if (data?.type === 'message' && data.conversationId) {
        qc.invalidateQueries({ queryKey: ['thread', data.conversationId] });
        qc.invalidateQueries({ queryKey: ['messages'] });
      } else {
        qc.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'meta' });
      }
    });
    return () => sub.remove();
  }, [qc]);

  // A notification was tapped (also covers opening the app from one).
  useEffect(() => {
    if (!ready || !lastResponse) return;
    const key = lastResponse.notification.request.identifier;
    if (handled.current === key || lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    handled.current = key;
    const target = routeFor(lastResponse.notification.request.content.data as Record<string, unknown>);
    if (target) router.push(target);
    Notifications.clearLastNotificationResponse();
  }, [ready, lastResponse]);

  return <>{children}</>;
}

/** Sign out, first telling the website to stop pushing to this phone. */
export function useSignOut() {
  const { signOut } = useAuth();
  const apiFetch = useApiFetch();
  return async () => {
    const s = pushState();
    if (s.status === 'enabled') {
      await apiFetch('/push-token', { method: 'DELETE', body: JSON.stringify({ token: s.token }) }).catch(() => {});
    }
    resetPush();
    await signOut();
  };
}
