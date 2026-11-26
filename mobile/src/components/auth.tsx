import { useSignIn } from '@clerk/expo';
import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { View, type TextInputProps } from 'react-native';

import { Button, Field, Gap, Notice, T } from '@/components/ui';
import { useInfoSheet } from '@/components/info-sheet';
import { clerkMessage, must, useGoogle } from '@/lib/auth';
import { space, useColors } from '@/theme';

/** The top of every auth screen: the logo, a title and one line under it. */
export function AuthHeader({ title, subtitle }: { title: string; subtitle?: ReactNode }) {
  return (
    <Gap size={space.md} style={{ marginBottom: space.sm }}>
      <Image source={require('@/assets/images/logo.png')} style={{ width: 44, height: 52 }} contentFit="contain" accessibilityLabel="Servhive" />
      <Gap size={space.xs}>
        <T v="title">{title}</T>
        {subtitle ? <T color="muted">{subtitle}</T> : null}
      </Gap>
    </Gap>
  );
}

/** "Continue with Google", with its own error line. */
export function GoogleButton({ disabled }: { disabled?: boolean }) {
  const google = useGoogle();
  return (
    <Gap size={space.sm}>
      <Button title="Continue with Google" kind="secondary" icon="logo-google" loading={google.pending} disabled={disabled} onPress={google.start} />
      {google.error ? <Notice tone="danger">{google.error}</Notice> : null}
    </Gap>
  );
}

export function OrDivider() {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, marginVertical: space.xs }}>
      <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
      <T v="caption">or</T>
      <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
    </View>
  );
}

export function EmailField(props: { value: string; onChangeText: (v: string) => void; error?: string | null } & Pick<TextInputProps, 'onSubmitEditing' | 'returnKeyType' | 'editable'>) {
  return (
    <Field
      label="Email"
      placeholder="you@example.com"
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="email-address"
      autoComplete="email"
      textContentType="emailAddress"
      {...props}
    />
  );
}

/** A password field with a show/hide switch. `isNew` lets the phone suggest a strong password. */
export function PasswordField({
  label = 'Password',
  isNew = false,
  hint,
  ...props
}: { label?: string; isNew?: boolean; hint?: string; value: string; onChangeText: (v: string) => void; error?: string | null } & Pick<TextInputProps, 'onSubmitEditing' | 'returnKeyType'>) {
  const [shown, setShown] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Field
        label={label}
        secureTextEntry={!shown}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete={isNew ? 'new-password' : 'current-password'}
        textContentType={isNew ? 'newPassword' : 'password'}
        hint={hint}
        {...props}
      />
      <T v="small" color="accent" onPress={() => setShown(!shown)} style={{ alignSelf: 'flex-start' }} suppressHighlighting>
        {shown ? 'Hide password' : 'Show password'}
      </T>
    </View>
  );
}

/** The 6-digit code Clerk emails. The phone can fill it from the email on iOS. */
export function CodeField(props: { value: string; onChangeText: (v: string) => void; error?: string | null; onSubmitEditing?: () => void }) {
  return (
    <Field
      label="Code"
      placeholder="123456"
      keyboardType="number-pad"
      autoComplete="one-time-code"
      textContentType="oneTimeCode"
      maxLength={6}
      style={{ letterSpacing: 6, fontSize: 22 }}
      {...props}
      onChangeText={(v) => props.onChangeText(v.replace(/\D/g, ''))}
    />
  );
}

/** "Didn't get it? Send again", with a short cool-down so taps don't spam the inbox. */
export function ResendCode({ onResend }: { onResend: () => Promise<void> }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  async function resend() {
    if (state !== 'idle') return;
    setState('sending');
    try {
      await onResend();
      setState('sent');
      setTimeout(() => setState('idle'), 20_000);
    } catch {
      setState('idle');
    }
  }
  return (
    <T v="small" color={state === 'idle' ? 'accent' : 'muted'} onPress={resend} style={{ alignSelf: 'center' }} suppressHighlighting>
      {state === 'sending' ? 'Sending…' : state === 'sent' ? 'New code sent. Check your inbox.' : "Didn't get it? Send a new code"}
    </T>
  );
}

export function LegalLine() {
  const info = useInfoSheet();
  return (
    <T v="caption" style={{ textAlign: 'center' }}>
      By continuing you agree to the{' '}
      <T v="caption" color="accent" onPress={() => info.open('legal:terms')}>
        Terms of Use
      </T>{' '}
      and{' '}
      <T v="caption" color="accent" onPress={() => info.open('legal:privacy')}>
        Privacy Policy
      </T>
      .
    </T>
  );
}

// ── Finishing a sign-in ──────────────────────────────────────────────────────

type SignInFuture = ReturnType<typeof useSignIn>['signIn'];
type SecondFactor = 'email_code' | 'phone_code' | 'totp';

/**
 * What to do after a sign-in step: finish (make the session active), or ask
 * for a second code. Clerk asks for an emailed code when someone signs in on a
 * device it hasn't seen ("client trust") or has two-step verification on.
 */
export async function continueSignIn(signIn: SignInFuture): Promise<{ next: 'done' } | { next: 'code'; strategy: SecondFactor }> {
  if (signIn.status === 'complete') {
    must(await signIn.finalize());
    return { next: 'done' };
  }
  if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
    const offered = signIn.supportedSecondFactors.map((f) => f.strategy);
    const strategy = (['email_code', 'phone_code', 'totp'] as const).find((s) => offered.includes(s));
    if (!strategy) throw new Error('This account uses a sign-in check the app does not support yet. Please sign in on the website.');
    if (strategy === 'email_code') must(await signIn.mfa.sendEmailCode());
    if (strategy === 'phone_code') must(await signIn.mfa.sendPhoneCode());
    return { next: 'code', strategy };
  }
  if (signIn.status === 'needs_new_password') throw new Error('Please set a new password: tap "Forgot password?" on the sign-in screen.');
  throw new Error('Sign-in could not be finished. Please try again.');
}

/** The "enter the code we sent" step of a sign-in. */
export function SecondFactorStep({ strategy, onBack }: { strategy: SecondFactor; onBack: () => void }) {
  const { signIn, fetchStatus } = useSignIn();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function verify() {
    if (code.length < 6 || pending) return;
    setError(null);
    setPending(true);
    try {
      if (strategy === 'email_code') must(await signIn.mfa.verifyEmailCode({ code }));
      else if (strategy === 'phone_code') must(await signIn.mfa.verifyPhoneCode({ code }));
      else must(await signIn.mfa.verifyTOTP({ code }));
      const r = await continueSignIn(signIn);
      if (r.next !== 'done') throw new Error('Sign-in could not be finished. Please try again.');
    } catch (e) {
      setError(clerkMessage(e));
    } finally {
      setPending(false);
    }
  }

  const where =
    strategy === 'email_code'
      ? 'We emailed you a 6-digit code to confirm it’s really you.'
      : strategy === 'phone_code'
        ? 'We texted you a 6-digit code to confirm it’s really you.'
        : 'Enter the 6-digit code from your authenticator app.';

  return (
    <Gap size={space.lg}>
      <AuthHeader title="Check your inbox" subtitle={strategy === 'totp' ? where : `${where}${signIn.identifier ? ` It went to ${signIn.identifier}.` : ''}`} />
      <CodeField value={code} onChangeText={setCode} onSubmitEditing={verify} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Continue" loading={pending} disabled={code.length < 6 || fetchStatus === 'fetching'} onPress={verify} />
      {strategy !== 'totp' ? (
        <ResendCode
          onResend={async () => {
            must(strategy === 'email_code' ? await signIn.mfa.sendEmailCode() : await signIn.mfa.sendPhoneCode());
          }}
        />
      ) : null}
      <Button title="Use a different account" kind="ghost" small onPress={onBack} />
    </Gap>
  );
}
