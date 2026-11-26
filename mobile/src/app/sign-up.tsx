import { useSignUp } from '@clerk/expo';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AuthHeader, CodeField, EmailField, GoogleButton, LegalLine, OrDivider, PasswordField, ResendCode } from '@/components/auth';
import { Button, Field, Gap, Notice, Screen, T } from '@/components/ui';
import { clerkMessage, must } from '@/lib/auth';
import { space } from '@/theme';

type Step = 'details' | 'verify' | 'name';

/**
 * Create an account in the app: email + password, then the 6-digit code Clerk
 * emails to prove the address. Password rules (length etc.) come from the
 * Clerk dashboard; the app shows Clerk's own message when one isn't met.
 * Choosing client or artisan happens next, on the set-up screen.
 */
export default function SignUp() {
  const params = useLocalSearchParams<{ email?: string }>();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [step, setStep] = useState<Step>('details');
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const busy = pending || fetchStatus === 'fetching';

  async function run(fn: () => Promise<void>) {
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      await fn();
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  /** After each step: finish, or collect what Clerk still needs. */
  async function finishOrContinue() {
    if (signUp.status === 'complete') {
      must(await signUp.finalize()); // the root layout takes it from here
      return;
    }
    const missing = signUp.missingFields;
    if (missing.includes('legal_accepted')) {
      // They agreed to the Terms on this screen (the line under the button).
      must(await signUp.update({ legalAccepted: true }));
      return finishOrContinue();
    }
    if (missing.includes('first_name') || missing.includes('last_name')) {
      setStep('name');
      return;
    }
    if (signUp.unverifiedFields.includes('email_address')) {
      setStep('verify');
      return;
    }
    throw new Error('Your account needs a detail the app can’t collect yet. Please finish signing up on the website.');
  }

  const createAccount = () =>
    run(async () => {
        must(await signUp.password({ emailAddress: email.trim(), password }));
        must(await signUp.verifications.sendEmailCode());
        setCode('');
        setStep('verify');
    });

  const verify = () =>
    run(async () => {
        if (code.length < 6) return;
        must(await signUp.verifications.verifyEmailCode({ code }));
        await finishOrContinue();
    });

  const saveName = () =>
    run(async () => {
        must(await signUp.update({ firstName: firstName.trim(), lastName: lastName.trim() }));
        await finishOrContinue();
    });

  const msg = (f: { message: string; longMessage?: string } | null) => f?.longMessage ?? f?.message;

  return (
    <Screen keyboard contentStyle={{ paddingTop: space.md }}>
      {step === 'details' ? (
        <Gap size={space.lg}>
          <AuthHeader title="Create your account" subtitle="Hire verified artisans, or list your trade. You’ll choose on the next screen." />
          <GoogleButton disabled={busy} />
          <OrDivider />
          <EmailField value={email} onChangeText={setEmail} error={msg(errors.fields.emailAddress)} returnKeyType="next" />
          <PasswordField isNew value={password} onChangeText={setPassword} error={msg(errors.fields.password)} returnKeyType="go" onSubmitEditing={createAccount} />
          {error && !errors.fields.emailAddress && !errors.fields.password ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Create account" loading={pending} disabled={!email.trim() || !password || busy} onPress={createAccount} />
          <LegalLine />
          <T v="small" color="muted" style={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <T v="small" color="accent" onPress={() => router.replace({ pathname: '/sign-in', params: { email: email.trim() } })}>
              Sign in
            </T>
          </T>
        </Gap>
      ) : step === 'verify' ? (
        <Gap size={space.lg}>
          <AuthHeader title="Check your inbox" subtitle={`We sent a 6-digit code to ${signUp.emailAddress ?? email.trim()}. Enter it to confirm your email.`} />
          <CodeField value={code} onChangeText={setCode} error={msg(errors.fields.code)} onSubmitEditing={verify} />
          {error && !errors.fields.code ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Confirm email" loading={pending} disabled={code.length < 6 || busy} onPress={verify} />
          <ResendCode onResend={async () => must(await signUp.verifications.sendEmailCode())} />
          <Button
            title="Change email"
            kind="ghost"
            small
            onPress={async () => {
              await signUp.reset();
              setStep('details');
            }}
          />
        </Gap>
      ) : (
        <Gap size={space.lg}>
          <AuthHeader title="What’s your name?" subtitle="Artisans and clients see this on quotes and messages." />
          <Field label="First name" value={firstName} onChangeText={setFirstName} autoComplete="given-name" textContentType="givenName" error={msg(errors.fields.firstName)} />
          <Field label="Last name" value={lastName} onChangeText={setLastName} autoComplete="family-name" textContentType="familyName" error={msg(errors.fields.lastName)} />
          {error && !errors.fields.firstName && !errors.fields.lastName ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Continue" loading={pending} disabled={!firstName.trim() || busy} onPress={saveName} />
        </Gap>
      )}
    </Screen>
  );
}
