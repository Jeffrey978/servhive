import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
  useFonts,
} from '@expo-google-fonts/instrument-sans';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/toast';
import { Button, ErrorState, T } from '@/components/ui';
import { SessionProvider, useSession } from '@/lib/session';
import { fonts, palettes, space } from '@/theme';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 20_000 } } }));
  const [fontsLoaded] = useFonts({ InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold });
  const scheme = useColorScheme();

  if (!publishableKey) {
    return <MissingKey />;
  }
  if (!fontsLoaded) return null; // the splash screen stays up

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const p = scheme === 'dark' ? palettes.dark : palettes.light;
  const navTheme = { ...base, colors: { ...base.colors, primary: p.accent, background: p.bg, card: p.surface, text: p.text, border: p.border } };

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider value={navTheme}>
            <ToastProvider>
              <SessionProvider>
                <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                <RootNavigator />
              </SessionProvider>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function RootNavigator() {
  const session = useSession();
  const scheme = useColorScheme();
  const p = scheme === 'dark' ? palettes.dark : palettes.light;

  useEffect(() => {
    if (session.status !== 'loading') SplashScreen.hideAsync();
  }, [session.status]);

  if (session.status === 'loading') return null;
  if (session.status === 'error') return <BootError />;

  const user = session.me?.user;
  const signedIn = session.status === 'ready';
  const onboarded = signedIn && !!user?.onboarded;
  const role = user?.role;
  const isClient = onboarded && role === 'CLIENT';
  const isPro = onboarded && role === 'ARTISAN';

  return (
    <Stack
      screenOptions={{
        headerTintColor: p.accent,
        headerTitleStyle: { fontFamily: fonts.semibold, color: p.text },
        headerStyle: { backgroundColor: p.bg },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: p.bg },
      }}>
      {/* Decides where to go (src/app/index.tsx). */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && !onboarded}>
        <Stack.Screen name="onboarding" options={{ title: 'Set up your account' }} />
      </Stack.Protected>

      <Stack.Protected guard={onboarded && role === 'ADMIN'}>
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Client side */}
      <Stack.Protected guard={isClient}>
        <Stack.Screen name="client" options={{ headerShown: false }} />
        <Stack.Screen name="request/[providerId]" options={{ title: 'Request a quote', presentation: 'modal' }} />
        <Stack.Screen name="book/[serviceId]" options={{ title: 'Book this service', presentation: 'modal' }} />
        <Stack.Screen name="report/[providerId]" options={{ title: 'Report an artisan', presentation: 'modal' }} />
        <Stack.Screen name="job/[id]" options={{ title: 'Job' }} />
        <Stack.Screen name="dispute/[jobId]" options={{ title: 'Open a dispute', presentation: 'modal' }} />
        <Stack.Screen name="review/[jobId]" options={{ title: 'Leave a review', presentation: 'modal' }} />
        <Stack.Screen name="saved" options={{ title: 'Saved artisans' }} />
        <Stack.Screen name="reports" options={{ title: 'Your reports' }} />
      </Stack.Protected>

      {/* Artisan side */}
      <Stack.Protected guard={isPro}>
        <Stack.Screen name="pro" options={{ headerShown: false }} />
        <Stack.Screen name="manage/quote/[id]" options={{ title: 'Send a quote', presentation: 'modal' }} />
        <Stack.Screen name="manage/job/[id]" options={{ title: 'Job' }} />
        <Stack.Screen name="manage/profile" options={{ title: 'Your profile' }} />
        <Stack.Screen name="manage/service" options={{ title: 'Service', presentation: 'modal' }} />
        <Stack.Screen name="manage/photos" options={{ title: 'Work photos' }} />
        <Stack.Screen name="manage/verification" options={{ title: 'Verification' }} />
        <Stack.Screen name="manage/payout" options={{ title: 'Payout account' }} />
        <Stack.Screen name="manage/billing" options={{ title: 'Membership & boost' }} />
        <Stack.Screen name="manage/complaints" options={{ title: 'Complaints' }} />
      </Stack.Protected>

      {/* Both sides */}
      <Stack.Protected guard={isClient || isPro}>
        <Stack.Screen name="artisan/[slug]" options={{ title: '' }} />
        <Stack.Screen name="thread/[id]" options={{ title: 'Messages' }} />
      </Stack.Protected>
    </Stack>
  );
}

function BootError() {
  const session = useSession();
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: space.xl, gap: space.lg, backgroundColor: palettes.light.bg }}>
      <ErrorState error={session.error} onRetry={session.retry} />
      <Button title="Sign out" kind="ghost" onPress={() => signOut()} />
    </View>
  );
}

function MissingKey() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: space.xl, gap: space.md }}>
      <T v="h2">Almost there</T>
      <T>
        Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to mobile/.env (copy it from Vercel's NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), then restart with
        npx expo start -c.
      </T>
    </View>
  );
}
