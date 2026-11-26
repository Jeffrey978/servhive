import { useSignIn } from '@clerk/expo';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AuthHeader, continueSignIn, EmailField, GoogleButton, OrDivider, PasswordField, SecondFactorStep } from '@/components/auth';
import { Button, Gap, Notice, Screen, T } from '@/components/ui';
import { clerkMessage, must } from '@/lib/auth';
import { space } from '@/theme';

/** Email + password sign-in, drawn in the app (no browser page). */
export default function SignIn() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState<null | 'email_code' | 'phone_code' | 'totp'>(null);

  async function submit() {
    if (pending || !email.trim() || !password) return;
    setError(null);
    setPending(true);
    try {
      must(await signIn.password({ identifier: email.trim(), password }));
      const r = await continueSignIn(signIn);
      if (r.next === 'code') setCode(r.strategy);
      // 'done': the session is live and the root layout moves on by itself.
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  async function startOver() {
    await signIn.reset();
    setCode(null);
    setPassword('');
  }

  return (
    <Screen keyboard contentStyle={{ paddingTop: space.md }}>
      {code ? (
        <SecondFactorStep strategy={code} onBack={startOver} />
      ) : (
        <Gap size={space.lg}>
          <AuthHeader title="Welcome back" subtitle="Sign in to your Servhive account." />
          <GoogleButton disabled={pending} />
          <OrDivider />
          <EmailField value={email} onChangeText={setEmail} error={errors.fields.identifier?.longMessage ?? errors.fields.identifier?.message} returnKeyType="next" />
          <PasswordField
            value={password}
            onChangeText={setPassword}
            error={errors.fields.password?.longMessage ?? errors.fields.password?.message}
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <T
            v="small"
            color="accent"
            style={{ alignSelf: 'flex-end', marginTop: -space.sm }}
            onPress={() => router.push({ pathname: '/forgot-password', params: { email: email.trim() } })}
            suppressHighlighting>
            Forgot password?
          </T>
          {/* Field problems show under their field; anything else shows here. */}
          {error && !errors.fields.identifier && !errors.fields.password ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Sign in" loading={pending} disabled={!email.trim() || !password || fetchStatus === 'fetching'} onPress={submit} />
          <T v="small" color="muted" style={{ textAlign: 'center' }}>
            New to Servhive?{' '}
            <T v="small" color="accent" onPress={() => router.replace({ pathname: '/sign-up', params: { email: email.trim() } })}>
              Create an account
            </T>
          </T>
        </Gap>
      )}
    </Screen>
  );
}
