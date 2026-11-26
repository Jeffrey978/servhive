import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, radius, space, useColors } from '@/theme';

type Toast = { id: number; message: string; tone: 'success' | 'error' };
const Ctx = createContext<(message: string, tone?: Toast['tone']) => void>(() => {});

/** Short confirmation banners ("Quote sent.") at the top of the screen. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const seq = useRef(0);
  const show = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    seq.current += 1;
    setToast({ id: seq.current, message, tone });
  }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      {toast ? <Banner key={toast.id} toast={toast} onDone={() => setToast(null)} /> : null}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);

function Banner({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(-120)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
      Animated.delay(toast.tone === 'error' ? 4200 : 2600),
      Animated.timing(y, { toValue: -140, duration: 220, useNativeDriver: true }),
    ]).start(({ finished }) => finished && onDone());
  }, [y, toast.tone, onDone]);
  const fg = toast.tone === 'error' ? c.danger : c.success;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={{ position: 'absolute', left: space.lg, right: space.lg, top: insets.top + space.sm, transform: [{ translateY: y }] }}>
      <View
        style={{
          backgroundColor: c.surface,
          borderRadius: radius.lg,
          padding: space.md,
          flexDirection: 'row',
          gap: space.sm,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
          borderWidth: 1,
          borderColor: c.border,
        }}>
        <Ionicons name={toast.tone === 'error' ? 'alert-circle' : 'checkmark-circle'} size={22} color={fg} />
        <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 15, color: c.text }}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}
