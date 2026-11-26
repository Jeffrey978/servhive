import { useClerk, useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Lets the Google sign-in browser sheet hand its result back to the app.
WebBrowser.maybeCompleteAuthSession();

/**
 * Clerk's own wording for an auth error ("Password must be at least 8
 * characters", "Incorrect code"...). Rules such as the password length live
 * in the Clerk dashboard, so the app repeats what Clerk says, never its own.
 */
export function clerkMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!e) return fallback;
  const x = e as { errors?: { longMessage?: string; message?: string }[]; longMessage?: string; message?: string };
  const first = x.errors?.[0];
  return first?.longMessage || first?.message || x.longMessage || x.message || fallback;
}

/** Throws a Future-API `{ error }` result so one try/catch handles every step. */
export function must(res: { error: unknown }) {
  if (res.error) throw res.error;
}

/**
 * "Continue with Google". Opens Google in a secure browser sheet and, when it
 * comes back, makes the new session active (the root layout then moves on).
 * Works the same for new and returning users.
 */
export function useGoogle() {
  const { startSSOFlow } = useSSO();
  const { setActive } = useClerk();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Android opens the browser faster when it's warmed up first.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  async function start() {
    setError(null);
    setPending(true);
    try {
      const res = await startSSOFlow({ strategy: 'oauth_google', redirectUrl: AuthSession.makeRedirectUri({ path: 'sso-callback' }) });
      if (res.createdSessionId) {
        await (res.setActive ?? setActive)({ session: res.createdSessionId });
      } else if (res.authSessionResult?.type === 'success') {
        // Google worked but Clerk wants more than Google gave (rare: a required field Google doesn't share).
        setError('Google sign-in needs one more step. Please use email and password instead.');
      }
      // Cancelled or dismissed: nothing to say.
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  return { start, pending, error };
}
