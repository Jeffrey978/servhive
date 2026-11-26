import { useSignIn } from '@clerk/expo';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AuthHeader, CodeField, continueSignIn, EmailField, PasswordField, ResendCode, SecondFactorStep } from '@/components/auth';
import { Button, Gap, Notice, Screen } from '@/components/ui';
import { clerkMessage, must } from '@/lib/auth';
import { space } from '@/theme';

/**
 * Reset a forgotten password: Clerk emails a code, then the new password is
 * set and the person is signed in. The password rules are Clerk's.
 */
export default function ForgotPassword() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [codeOk, setCodeOk] = useState(false);
  const [password, setPassword] = useState('');
  const [second, setSecond] = useState<null | 'email_code' | 'phone_code' | 'totp'>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const busy = pending || fetchStatus === 'fetching';
  const msg = (f: { message: string; longMessage?: string } | null) => f?.longMessage ?? f?.message;

  async function sendCode() {
    if (pending || !email.trim()) return;
    setError(null);
    setPending(true);
    try {
      must(await signIn.create({ identifier: email.trim() }));
      must(await signIn.resetPasswordEmailCode.sendCode());
      setStep('reset');
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  async function reset() {
    if (pending || code.length < 6 || !password) return;
    setError(null);
    setPending(true);
    try {
      // The code is checked once; if only the password was rejected, a retry skips straight to it.
      if (!codeOk) {
        must(await signIn.resetPasswordEmailCode.verifyCode({ code }));
        setCodeOk(true);
      }
      must(await signIn.resetPasswordEmailCode.submitPassword({ password, signOutOfOtherSessions: true }));
      const r = await continueSignIn(signIn);
      if (r.next === 'code') setSecond(r.strategy);
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  if (second) {
    return (
      <Screen keyboard contentStyle={{ paddingTop: space.md }}>
        <SecondFactorStep strategy={second} onBack={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen keyboard contentStyle={{ paddingTop: space.md }}>
      {step === 'email' ? (
        <Gap size={space.lg}>
          <AuthHeader title="Forgot your password?" subtitle="Enter your email and we’ll send you a code to set a new one." />
          <EmailField value={email} onChangeText={setEmail} error={msg(errors.fields.identifier)} returnKeyType="send" onSubmitEditing={sendCode} />
          {error && !errors.fields.identifier ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Send code" loading={pending} disabled={!email.trim() || busy} onPress={sendCode} />
        </Gap>
      ) : (
        <Gap size={space.lg}>
          <AuthHeader title="Set a new password" subtitle={`We sent a 6-digit code to ${email.trim()}.`} />
          {!codeOk ? <CodeField value={code} onChangeText={setCode} error={msg(errors.fields.code)} /> : <Notice tone="success">Code confirmed.</Notice>}
          <PasswordField label="New password" isNew value={password} onChangeText={setPassword} error={msg(errors.fields.password)} returnKeyType="go" onSubmitEditing={reset} />
          {error && !errors.fields.code && !errors.fields.password ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Save and sign in" loading={pending} disabled={code.length < 6 || !password || busy} onPress={reset} />
          {!codeOk ? <ResendCode onResend={async () => must(await signIn.resetPasswordEmailCode.sendCode())} /> : null}
        </Gap>
      )}
    </Screen>
  );
}
