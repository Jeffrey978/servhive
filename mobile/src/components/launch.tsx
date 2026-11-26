import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { fonts, palettes } from '@/theme';

const SPLASH_BG = { light: '#FFFFFF', dark: '#12100D' }; // must match app.json's expo-splash-screen colours
const LOGO = 120; // app.json imageWidth: the logo starts exactly where the system splash left it

/**
 * The animated launch screen. It takes over from the system splash with the
 * same image in the same place, then comes alive (the logo breathes, an
 * orange ripple spreads behind it, three dots bounce) until the app knows who
 * is signed in. When `done` flips, it lifts away and fades into the app, so
 * there is never a blank frame. `label` shows under the dots ("Signing you in…").
 */
export function LaunchOverlay({ done, label }: { done: boolean; label?: string }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const p = palettes[scheme];
  const [gone, setGone] = useState(false);
  const [breath] = useState(() => new Animated.Value(0));
  const [ripple] = useState(() => new Animated.Value(0));
  const [dots] = useState(() => [0, 1, 2].map(() => new Animated.Value(0)));
  const [exit] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(breath, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(breath, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ),
      Animated.loop(Animated.timing(ripple, { toValue: 1, duration: 1700, easing: Easing.out(Easing.cubic), useNativeDriver: true })),
      ...dots.map((d, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 140),
            Animated.timing(d, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(d, { toValue: 0, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.delay((2 - i) * 140 + 260),
          ]),
        ),
      ),
    ];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [breath, ripple, dots]);

  // Coming back (e.g. right after signing in): show again, from fully visible.
  const [wasDone, setWasDone] = useState(done);
  if (done !== wasDone) {
    setWasDone(done);
    if (!done) setGone(false);
  }

  useEffect(() => {
    if (!done) {
      exit.setValue(0);
      return;
    }
    Animated.timing(exit, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(({ finished }) => finished && setGone(true));
  }, [done, exit]);

  if (gone) return null;

  const logoScale = Animated.multiply(
    breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }),
    exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }),
  );

  return (
    <Animated.View
      pointerEvents={done ? 'none' : 'auto'}
      accessibilityLabel={label ?? 'Loading Servhive'}
      // The system splash hides only once this frame is on screen: a seamless handover.
      onLayout={() => SplashScreen.hideAsync().catch(() => {})}
      style={[StyleSheet.absoluteFill, { backgroundColor: SPLASH_BG[scheme], alignItems: 'center', justifyContent: 'center', zIndex: 100, opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}>
      <View style={{ width: LOGO, height: LOGO, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: LOGO,
            height: LOGO,
            borderRadius: LOGO / 2,
            backgroundColor: p.accent,
            opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0] }),
            transform: [{ scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.9] }) }],
          }}
        />
        <Animated.View style={{ transform: [{ scale: logoScale }] }}>
          <Image source={require('@/assets/images/splash-icon.png')} style={{ width: LOGO, height: LOGO }} contentFit="contain" />
        </Animated.View>
      </View>
      <View style={{ position: 'absolute', top: '50%', marginTop: LOGO / 2 + 40, alignItems: 'center', gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {dots.map((d, i) => (
            <Animated.View
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: p.accent,
                opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
                transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }],
              }}
            />
          ))}
        </View>
        {label ? <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: p.muted }}>{label}</Text> : null}
      </View>
    </Animated.View>
  );
}
