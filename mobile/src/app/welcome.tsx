import { useHostedAuth } from '@clerk/expo/hosted-auth';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Gap, Notice, T } from '@/components/ui';
import { errorMessage } from '@/lib/api';
import { space, useColors } from '@/theme';
import { useInfoSheet } from '@/components/info-sheet';

/**
 * Signed-out home. Sign-in opens Servhive's own Clerk sign-in page in a secure
 * browser sheet, so the app offers exactly the sign-in methods the website does.
 */
export default function Welcome() {
  const c = useColors();
  const { startHostedAuth } = useHostedAuth();
  const info = useInfoSheet();
  const [busy, setBusy] = useState<'sign-in' | 'sign-up' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(mode: 'sign-in' | 'sign-up') {
    setError(null);
    setBusy(mode);
    try {
      // Once a session is created, the root layout notices and routes onward.
      await startHostedAuth({ mode });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: space.xl, justifyContent: 'space-between' }}>
        <View style={{ gap: space.xl, marginTop: space.xxl }}>
          <Image source={require('@/assets/images/logo.png')} style={{ width: 64, height: 75 }} contentFit="contain" accessibilityLabel="Servhive" />
          <Gap size={space.md}>
            <T v="title" style={{ fontSize: 36, lineHeight: 42 }}>
              Skilled hands.{'\n'}
              <T v="title" color="accent" style={{ fontSize: 36, lineHeight: 42 }}>
                Safe
              </T>{' '}
              payments.
            </T>
            <T color="muted">Hire ID-verified artisans across Port Harcourt. Your money waits in escrow until the job is done.</T>
          </Gap>
          <Gap size={space.sm}>
            {[
              ['shield-checkmark', 'Every artisan is ID-verified'],
              ['lock-closed', 'Pay into escrow, release when happy'],
              ['chatbubbles', 'Quotes and messages in one place'],
            ].map(([, text]) => (
              <T key={text} v="small" color="muted">
                ·  {text}
              </T>
            ))}
          </Gap>
        </View>

        <Gap size={space.md}>
          {error ? <Notice tone="danger">{error}</Notice> : null}
          <Button title="Create an account" onPress={() => go('sign-up')} loading={busy === 'sign-up'} disabled={!!busy} />
          <Button title="Sign in" kind="secondary" onPress={() => go('sign-in')} loading={busy === 'sign-in'} disabled={!!busy} />
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
        </Gap>
      </View>
    </SafeAreaView>
  );
}
