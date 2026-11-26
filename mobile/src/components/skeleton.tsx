import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, View, type DimensionValue, type ViewStyle } from 'react-native';

import { radius, space, useColors } from '@/theme';

/**
 * Loading placeholders shaped like the screen that's coming, so the app never
 * shows a blank page or a lone spinner. All bones on screen share one pulse.
 */

const Pulse = createContext<Animated.Value | null>(null);

function PulseProvider({ children }: { children: ReactNode }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return <Pulse.Provider value={v}>{children}</Pulse.Provider>;
}

/** One grey shape. */
export function Bone({ w = '100%', h = 14, r = 7, style }: { w?: DimensionValue; h?: number; r?: number; style?: ViewStyle }) {
  const c = useColors();
  const pulse = useContext(Pulse);
  const opacity = pulse ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) : 1;
  return <Animated.View style={[{ width: w, height: h, borderRadius: r, backgroundColor: c.surface2, opacity }, style]} />;
}

function CardShell({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: c.border, padding: space.lg, gap: space.sm }, style]}>{children}</View>;
}

/** Generic: a few cards with a title line, a sub line and a badge. */
export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <PulseProvider>
      <View style={{ gap: space.md }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        {Array.from({ length: count }, (_, i) => (
          <CardShell key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
              <Bone w="55%" h={16} />
              <Bone w={64} h={16} />
            </View>
            <Bone w="40%" />
            <Bone w={84} h={22} r={11} style={{ marginTop: 4 }} />
          </CardShell>
        ))}
      </View>
    </PulseProvider>
  );
}

/** Rows with an avatar: directory, saved, inbox. */
export function SkeletonRows({ count = 6, avatar = 52 }: { count?: number; avatar?: number }) {
  return (
    <PulseProvider>
      <View style={{ gap: space.md }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        {Array.from({ length: count }, (_, i) => (
          <CardShell key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <Bone w={avatar} h={avatar} r={avatar / 2} />
            <View style={{ flex: 1, gap: space.sm }}>
              <Bone w="60%" h={16} />
              <Bone w="85%" />
            </View>
          </CardShell>
        ))}
      </View>
    </PulseProvider>
  );
}

/** A home dashboard: money strip, two stats, a list. */
export function SkeletonHome() {
  return (
    <PulseProvider>
      <View style={{ gap: space.lg }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        <Bone h={104} r={radius.lg} />
        <View style={{ flexDirection: 'row', gap: space.md }}>
          <Bone w="48%" h={78} r={radius.lg} style={{ flexGrow: 1 }} />
          <Bone w="48%" h={78} r={radius.lg} style={{ flexGrow: 1 }} />
        </View>
        <Bone w={130} h={12} />
        <CardShell>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.xs }}>
              <Bone w={38} h={38} r={12} />
              <View style={{ flex: 1, gap: 6 }}>
                <Bone w="70%" />
                <Bone w="45%" h={12} />
              </View>
            </View>
          ))}
        </CardShell>
      </View>
    </PulseProvider>
  );
}

/** An artisan profile: photo, name, buttons, sections. */
export function SkeletonProfile() {
  return (
    <PulseProvider>
      <View style={{ gap: space.lg }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
          <Bone w={84} h={84} r={42} />
          <View style={{ flex: 1, gap: space.sm }}>
            <Bone w={90} h={20} r={10} />
            <Bone w="80%" h={20} />
            <Bone w="55%" />
          </View>
        </View>
        <Bone h={50} r={25} />
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Bone w="48%" h={50} r={25} style={{ flexGrow: 1 }} />
          <Bone w="48%" h={50} r={25} style={{ flexGrow: 1 }} />
        </View>
        <Bone w={90} h={12} />
        <Bone h={14} />
        <Bone w="92%" h={14} />
        <Bone w="70%" h={14} />
        <Bone w={90} h={12} style={{ marginTop: space.sm }} />
        <CardShell>
          <Bone w="60%" />
          <Bone w="35%" h={12} />
        </CardShell>
      </View>
    </PulseProvider>
  );
}

/** A conversation: bubbles on both sides. */
export function SkeletonThread() {
  const sides: ('left' | 'right')[] = ['left', 'right', 'left', 'left', 'right'];
  const widths: DimensionValue[] = ['62%', '48%', '70%', '40%', '55%'];
  return (
    <PulseProvider>
      <View style={{ gap: space.md, padding: space.lg }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        {sides.map((side, i) => (
          <View key={i} style={{ alignItems: side === 'right' ? 'flex-end' : 'flex-start' }}>
            <Bone w={widths[i]} h={i % 2 ? 40 : 56} r={radius.lg} />
          </View>
        ))}
      </View>
    </PulseProvider>
  );
}

/** A form: label + field, a few times, then a button. */
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <PulseProvider>
      <View style={{ gap: space.lg }} accessibilityLabel="Loading" accessibilityRole="progressbar">
        {Array.from({ length: fields }, (_, i) => (
          <View key={i} style={{ gap: 6 }}>
            <Bone w={110} h={12} />
            <Bone h={50} r={radius.md} />
          </View>
        ))}
        <Bone h={50} r={25} />
      </View>
    </PulseProvider>
  );
}
