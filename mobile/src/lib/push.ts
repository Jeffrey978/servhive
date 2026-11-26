import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

/**
 * Push notifications. The website sends them through Expo's push service when
 * something happens (a message, a quote, a payment, a finished job, a
 * reminder). Each carries `data.type` so a tap opens the right screen.
 *
 * Needs a development or store build: Expo Go can't receive pushes (SDK 53+),
 * and the app must have an EAS project id (`npx eas-cli@latest init`).
 * Without those, `pushState()` explains why and the app falls back to
 * refreshing conversations while they're open.
 */

export type PushState =
  | { status: 'idle' }
  | { status: 'enabled'; token: string }
  | { status: 'unavailable'; reason: 'expo-go' | 'simulator' | 'no-project' | 'denied' | 'error'; detail?: string };

let state: PushState = { status: 'idle' };
const listeners = new Set<() => void>();
function set(next: PushState) {
  state = next;
  listeners.forEach((l) => l());
}

export const pushState = () => state;

/** React hook: the current push status. */
export function usePushState() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

/** The conversation on screen right now, so its own messages refresh instead of showing a banner. */
let openThread: string | null = null;
export function setOpenThread(id: string | null) {
  openThread = id;
}

// Foreground behaviour: show everything except a message for the thread you're already reading.
Notifications.setNotificationHandler({
  handleNotification: async (n) => {
    const data = n.request.content.data as { type?: string; conversationId?: string } | undefined;
    const reading = data?.type === 'message' && !!data.conversationId && data.conversationId === openThread;
    return { shouldShowBanner: !reading, shouldShowList: !reading, shouldPlaySound: !reading, shouldSetBadge: false };
  },
});

function projectId(): string | undefined {
  return Constants.easConfig?.projectId ?? (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
}

/**
 * Ask permission (once), get this phone's Expo push token and hand it to
 * `save` (which registers it with the website). Never throws.
 */
export async function registerForPush(save: (token: string, platform: 'ios' | 'android') => Promise<void>) {
  try {
    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return set({ status: 'unavailable', reason: 'expo-go' });
    if (!Device.isDevice) return set({ status: 'unavailable', reason: 'simulator' });
    const id = projectId();
    if (!id) return set({ status: 'unavailable', reason: 'no-project' });

    if (Platform.OS === 'android') {
      // Channels must exist before a token can be fetched on Android 13+.
      await Notifications.setNotificationChannelAsync('default', { name: 'Jobs and payments', importance: AndroidImportance.HIGH });
      await Notifications.setNotificationChannelAsync('messages', { name: 'Messages', importance: AndroidImportance.HIGH });
    }

    let perm = await Notifications.getPermissionsAsync();
    if (!perm.granted && perm.canAskAgain) perm = await Notifications.requestPermissionsAsync();
    const provisional = perm.ios?.status === IosAuthorizationStatus.PROVISIONAL;
    if (!perm.granted && !provisional) return set({ status: 'unavailable', reason: 'denied' });

    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId: id });
    await save(token, Platform.OS === 'ios' ? 'ios' : 'android');
    set({ status: 'enabled', token });
  } catch (e) {
    set({ status: 'unavailable', reason: 'error', detail: e instanceof Error ? e.message : String(e) });
  }
}

/** Forget this phone's token locally (after sign-out). */
export function resetPush() {
  set({ status: 'idle' });
}

/** Where a tapped notification should take the user. */
export function routeFor(data: Record<string, unknown> | undefined) {
  const type = typeof data?.type === 'string' ? data.type : '';
  const id = typeof data?.id === 'string' ? data.id : '';
  const conversationId = typeof data?.conversationId === 'string' ? data.conversationId : '';
  switch (type) {
    case 'message':
      return conversationId ? ({ pathname: '/thread/[id]', params: { id: conversationId } } as const) : null;
    case 'request':
      return '/pro/requests' as const;
    case 'quote':
      return { pathname: '/client/jobs', params: { tab: 'quotes' } } as const;
    case 'job':
      return id ? ({ pathname: '/job/[id]', params: { id } } as const) : ('/client/jobs' as const);
    case 'pro-job':
      return id ? ({ pathname: '/manage/job/[id]', params: { id } } as const) : ('/pro/jobs' as const);
    case 'complaints':
      return '/manage/complaints' as const;
    case 'billing':
      return '/manage/billing' as const;
    default:
      return null;
  }
}
