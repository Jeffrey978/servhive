import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonCards } from '@/components/skeleton';
import { errorMessage } from '@/lib/api';
import { STATUS, type Tone } from '@/lib/format';
import { fonts, radius, space, useColors, type Palette } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

// ── Text ─────────────────────────────────────────────────────────────────────

type Variant = 'title' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'small' | 'caption' | 'label';

const VARIANTS: Record<Variant, TextStyle> = {
  title: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.semibold, fontSize: 21, lineHeight: 27, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 23 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 23 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 17 },
  label: { fontFamily: fonts.semibold, fontSize: 11.5, lineHeight: 15, letterSpacing: 1.1, textTransform: 'uppercase' },
};

export function T({
  v = 'body',
  color,
  style,
  children,
  ...rest
}: { v?: Variant; color?: keyof Palette; style?: StyleProp<TextStyle>; children: ReactNode } & Omit<ComponentProps<typeof Text>, 'style'>) {
  const c = useColors();
  const fallback = v === 'caption' || v === 'label' ? c.muted : c.text;
  return (
    <Text style={[VARIANTS[v], { color: color ? c[color] : fallback }, style]} {...rest}>
      {children}
    </Text>
  );
}

// ── Layout ───────────────────────────────────────────────────────────────────

/** A scrolling screen with pull-to-refresh. Tabs pass `edges={['top']}`; pushed screens get a header instead. */
export function Screen({
  children,
  onRefresh,
  refreshing = false,
  edges = [],
  contentStyle,
  keyboard = false,
}: {
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  edges?: ('top' | 'bottom')[];
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
}) {
  const c = useColors();
  const body = (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bg }}
      contentContainerStyle={[{ padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} /> : undefined}>
      {children}
    </ScrollView>
  );
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.bg }}>
      {keyboard ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const c = useColors();
  const base: ViewStyle = { backgroundColor: c.surface, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: c.border, padding: space.lg, gap: space.sm };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}>
      {children}
    </Pressable>
  );
}

export function Gap({ size = space.sm, row = false, children, style }: { size?: number; row?: boolean; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ gap: size, flexDirection: row ? 'row' : 'column', alignItems: row ? 'center' : undefined }, style]}>{children}</View>;
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T v="label">{title}</T>
        {action}
      </View>
      {children}
    </View>
  );
}

// ── Buttons ──────────────────────────────────────────────────────────────────

type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  title,
  onPress,
  kind = 'primary',
  loading = false,
  disabled = false,
  icon,
  small = false,
  style,
}: {
  title: string;
  onPress?: () => void;
  kind?: ButtonKind;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const c = useColors();
  const bg = { primary: c.accent, secondary: c.surface, ghost: 'transparent', danger: c.dangerSoft }[kind];
  const fg = { primary: c.accentText, secondary: c.text, ghost: c.accent, danger: c.danger }[kind];
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy: loading }}
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [
        {
          minHeight: small ? 38 : 50,
          paddingHorizontal: small ? space.md : space.lg,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: kind === 'secondary' ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: c.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          opacity: off ? 0.55 : pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Ionicons name={icon} size={small ? 16 : 18} color={fg} /> : null}
      <Text style={{ fontFamily: fonts.semibold, fontSize: small ? 14 : 16, color: fg }}>{title}</Text>
    </Pressable>
  );
}

// ── Form fields ──────────────────────────────────────────────────────────────

export function Field({ label, hint, error, style, ...input }: { label: string; hint?: string; error?: string | null } & TextInputProps) {
  const c = useColors();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <T v="small" style={{ fontFamily: fonts.medium }}>
        {label}
      </T>
      <TextInput
        placeholderTextColor={c.faint}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        style={[
          {
            fontFamily: fonts.regular,
            fontSize: 16,
            color: c.text,
            backgroundColor: c.surface,
            borderRadius: radius.md,
            borderWidth: 1.5,
            borderColor: error ? c.danger : focused ? c.accent : c.border,
            paddingHorizontal: space.md,
            paddingVertical: input.multiline ? space.md : 0,
            minHeight: input.multiline ? 110 : 50,
            textAlignVertical: input.multiline ? 'top' : 'center',
          },
          style,
        ]}
        {...input}
      />
      {error ? (
        <T v="caption" color="danger">
          {error}
        </T>
      ) : hint ? (
        <T v="caption">{hint}</T>
      ) : null}
    </View>
  );
}

/** A tappable field that opens a list to choose one (or several) options. */
export function Select<V extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Choose…',
  multiple = false,
  values = [],
  onChangeMany,
  error,
  searchable,
}: {
  label: string;
  value?: V | '';
  options: { value: V; label: string; meta?: string }[];
  onChange?: (v: V) => void;
  placeholder?: string;
  multiple?: boolean;
  values?: V[];
  onChangeMany?: (v: V[]) => void;
  error?: string | null;
  searchable?: boolean;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const shown = multiple
    ? values.length
      ? options.filter((o) => values.includes(o.value)).map((o) => o.label).join(', ')
      : ''
    : options.find((o) => o.value === value)?.label ?? '';
  const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : options;
  const useSearch = searchable ?? options.length > 12;
  return (
    <View style={{ gap: 6 }}>
      <T v="small" style={{ fontFamily: fonts.medium }}>
        {label}
      </T>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={{
          minHeight: 50,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: error ? c.danger : c.border,
          backgroundColor: c.surface,
          paddingHorizontal: space.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.sm,
        }}>
        <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.regular, fontSize: 16, color: shown ? c.text : c.faint }}>
          {shown || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={c.muted} />
      </Pressable>
      {error ? (
        <T v="caption" color="danger">
          {error}
        </T>
      ) : null}
      <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space.lg }}>
            <T v="h3">{label}</T>
            <Button title="Done" kind="ghost" small onPress={() => setOpen(false)} />
          </View>
          {useSearch ? (
            <View style={{ paddingHorizontal: space.lg, paddingBottom: space.sm }}>
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search"
                placeholderTextColor={c.faint}
                style={{ fontFamily: fonts.regular, fontSize: 16, color: c.text, backgroundColor: c.surface, borderRadius: radius.md, paddingHorizontal: space.md, height: 44 }}
              />
            </View>
          ) : null}
          <FlatList
            data={filtered}
            keyExtractor={(o) => o.value}
            contentContainerStyle={{ paddingBottom: insets.bottom + space.xl }}
            renderItem={({ item }) => {
              const selected = multiple ? values.includes(item.value) : item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    if (multiple) {
                      onChangeMany?.(selected ? values.filter((v) => v !== item.value) : [...values, item.value]);
                    } else {
                      onChange?.(item.value);
                      setOpen(false);
                      setQ('');
                    }
                  }}
                  style={({ pressed }) => ({
                    paddingHorizontal: space.lg,
                    paddingVertical: space.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: space.md,
                    backgroundColor: pressed ? c.surface2 : 'transparent',
                  })}>
                  <View style={{ flex: 1 }}>
                    <T>{item.label}</T>
                    {item.meta ? <T v="caption">{item.meta}</T> : null}
                  </View>
                  {selected ? <Ionicons name="checkmark-circle" size={22} color={c.accent} /> : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

/** A row of choice chips (single select). */
export function Chips<V extends string>({ options, value, onChange }: { options: { value: V; label: string }[]; value: V; onChange: (v: V) => void }) {
  const c = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={{
              paddingHorizontal: space.md,
              height: 36,
              borderRadius: radius.pill,
              justifyContent: 'center',
              backgroundColor: on ? c.text : c.surface,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: on ? c.text : c.border,
            }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: on ? c.bg : c.text }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Tick box for consents. */
export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: checked ? c.accent : c.border,
          backgroundColor: checked ? c.accent : c.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}>
        {checked ? <Ionicons name="checkmark" size={16} color={c.accentText} /> : null}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

// ── Display ──────────────────────────────────────────────────────────────────

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = useColors();
  const map: Record<Tone, [string, string]> = {
    neutral: [c.surface2, c.muted],
    accent: [c.accentSoft, c.accent],
    info: [c.infoSoft, c.info],
    success: [c.successSoft, c.success],
    danger: [c.dangerSoft, c.danger],
    outline: ['transparent', c.muted],
  };
  const [bg, fg] = map[tone];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: radius.pill,
        backgroundColor: bg,
        borderWidth: tone === 'outline' ? 1 : 0,
        borderColor: c.border,
      }}>
      <Text style={{ fontFamily: fonts.semibold, fontSize: 12, color: fg }}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const [label, tone] = STATUS[status] ?? [status, 'neutral'];
  return <Badge label={label} tone={tone} />;
}

export function Avatar({ uri, name, size = 44 }: { uri?: string | null; name: string; size?: number }) {
  const c = useColors();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.surface2 }} contentFit="cover" />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.semibold, fontSize: size * 0.38, color: c.accent }}>{initials || '?'}</Text>
    </View>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={value >= i - 0.25 ? 'star' : value >= i - 0.75 ? 'star-half' : 'star-outline'} size={size} color={c.accent} />
      ))}
    </View>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: space.sm }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} accessibilityLabel={`${i} star${i > 1 ? 's' : ''}`} onPress={() => onChange(i)} hitSlop={6}>
          <Ionicons name={value >= i ? 'star' : 'star-outline'} size={32} color={c.accent} />
        </Pressable>
      ))}
    </View>
  );
}

/** A list row: icon or avatar, title, subtitle, and something on the right. */
export function Row({
  title,
  subtitle,
  icon,
  left,
  right,
  onPress,
  chevron = !!onPress,
}: {
  title: string;
  subtitle?: string | null;
  icon?: IconName;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
}) {
  const c = useColors();
  const inner = (
    <>
      {left ?? (icon ? (
        <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={19} color={c.accent} />
        </View>
      ) : null)}
      <View style={{ flex: 1, gap: 2 }}>
        <T v="bodyStrong" numberOfLines={1}>
          {title}
        </T>
        {subtitle ? (
          <T v="small" color="muted" numberOfLines={2}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={c.faint} /> : null}
    </>
  );
  const style: ViewStyle = { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm };
  if (!onPress) return <View style={style}>{inner}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && { opacity: 0.6 }]}>
      {inner}
    </Pressable>
  );
}

export function Divider() {
  const c = useColors();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border }} />;
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card style={{ flex: 1, gap: 4, padding: space.md }}>
      <T v="caption">{label}</T>
      <T v="h2">{value}</T>
      {hint ? <T v="caption">{hint}</T> : null}
    </Card>
  );
}

/** A coloured note box. */
export function Notice({ tone = 'info', title, children, icon }: { tone?: 'info' | 'success' | 'danger' | 'accent'; title?: string; children?: ReactNode; icon?: IconName }) {
  const c = useColors();
  const [bg, fg] = { info: [c.infoSoft, c.info], success: [c.successSoft, c.success], danger: [c.dangerSoft, c.danger], accent: [c.accentSoft, c.accent] }[tone];
  return (
    <View style={{ backgroundColor: bg, borderRadius: radius.md, padding: space.md, flexDirection: 'row', gap: space.sm }}>
      <Ionicons name={icon ?? (tone === 'danger' ? 'alert-circle' : tone === 'success' ? 'checkmark-circle' : 'information-circle')} size={20} color={fg} />
      <View style={{ flex: 1, gap: 2 }}>
        {title ? <T v="bodyStrong" style={{ color: fg }}>{title}</T> : null}
        {typeof children === 'string' ? <T v="small">{children}</T> : children}
      </View>
    </View>
  );
}

// ── States ───────────────────────────────────────────────────────────────────

export function Loading({ label }: { label?: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: space.md, backgroundColor: c.bg }}>
      <ActivityIndicator color={c.accent} size="large" />
      {label ? <T v="small" color="muted">{label}</T> : null}
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <Card style={{ alignItems: 'center', gap: space.md, paddingVertical: space.xl }}>
      <T v="h3">Couldn't load this</T>
      <T v="small" color="muted" style={{ textAlign: 'center' }}>
        {errorMessage(error)}
      </T>
      {onRetry ? <Button title="Try again" kind="secondary" small onPress={onRetry} /> : null}
    </Card>
  );
}

export function Empty({ icon = 'leaf-outline', title, body, action }: { icon?: IconName; title: string; body?: string; action?: ReactNode }) {
  const c = useColors();
  return (
    <Card style={{ alignItems: 'center', paddingVertical: space.xxl, gap: space.sm }}>
      <Ionicons name={icon} size={30} color={c.faint} />
      <T v="h3" style={{ textAlign: 'center' }}>
        {title}
      </T>
      {body ? (
        <T v="small" color="muted" style={{ textAlign: 'center', maxWidth: 300 }}>
          {body}
        </T>
      ) : null}
      {action}
    </Card>
  );
}

/**
 * Wraps a query's loading/error states so screens only handle data. While
 * loading it shows `skeleton` (placeholder shapes of the coming screen).
 */
export function QueryView<D>({
  query,
  children,
  skeleton,
}: {
  query: { data?: D; isPending: boolean; error: unknown; refetch: () => unknown };
  children: (data: D) => ReactNode;
  skeleton?: ReactNode;
}) {
  if (query.isPending) return <>{skeleton ?? <SkeletonCards />}</>;
  if (query.error || query.data === undefined) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  return <>{children(query.data)}</>;
}
