import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleButton, LegalLine } from '@/components/auth';
import { Button, Gap, T } from '@/components/ui';
import { space, useColors } from '@/theme';

/**
 * Signed-out home. Sign-in and sign-up are the app's own screens (Clerk's
 * in-app API), so nothing opens in a browser except Google's own consent page.
 */
export default function Welcome() {
  const c = useColors();

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
          <Button title="Create an account" onPress={() => router.push('/sign-up')} />
          <Button title="Sign in" kind="secondary" onPress={() => router.push('/sign-in')} />
          <GoogleButton />
          <LegalLine />
        </Gap>
      </View>
    </SafeAreaView>
  );
}
