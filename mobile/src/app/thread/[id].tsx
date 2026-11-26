import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonThread } from '@/components/skeleton';
import { ErrorState, Notice, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { ago } from '@/lib/format';
import { setOpenThread, usePushState } from '@/lib/push';
import { useSession } from '@/lib/session';
import type { Thread } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { fonts, radius, space, useColors } from '@/theme';

/**
 * One conversation (website: /account/messages/[id] and /pro/messages/[id]).
 * New messages arrive by push: the push for this thread refreshes it at once
 * (no banner, no polling). Only when push can't work on this phone (Expo Go,
 * notifications off) does it fall back to refreshing every 10 seconds.
 * Messages that look like an attempt to take payment off Servhive are flagged.
 */
export default function ThreadScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const role = useSession().me?.user.role;
  const live = usePushState().status === 'enabled';
  const q = useApi<Thread>(['thread', id], `/messages/${encodeURIComponent(id)}`, { refetchInterval: live ? undefined : 10_000 });

  // While this thread is on screen, its pushes refresh it instead of showing a banner.
  useFocusEffect(
    useCallback(() => {
      setOpenThread(id);
      return () => setOpenThread(null);
    }, [id]),
  );
  const send = useSubmit(role === 'ARTISAN' ? 'pro.sendMessage' : 'client.sendMessage');
  const [body, setBody] = useState('');

  async function onSend() {
    const text = body.trim();
    if (!text) return;
    const res = await send.submit({ conversationId: id, body: text });
    if (res.ok) setBody('');
  }

  const messages = q.data ? [...q.data.messages].reverse() : [];

  return (
    <>
      <Stack.Screen options={{ title: q.data?.counterpart.name ?? 'Messages' }} />
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        {q.isPending ? (
          <SkeletonThread />
        ) : q.error ? (
          <View style={{ padding: space.lg }}>
            <ErrorState error={q.error} onRetry={() => q.refetch()} />
          </View>
        ) : (
          <FlatList
            inverted
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: space.lg, gap: space.sm }}
            onRefresh={() => q.refetch()}
            refreshing={q.isRefetching}
            ListFooterComponent={
              <View style={{ marginBottom: space.md, gap: space.sm }}>
                <Notice tone="accent" icon="shield-checkmark">
                  Keep payment on Servhive. Money paid outside the app isn't protected by escrow.
                </Notice>
                {!live ? (
                  <T v="caption" style={{ textAlign: 'center' }}>
                    Turn on notifications to get replies instantly. Until then this chat refreshes every few seconds.
                  </T>
                ) : null}
              </View>
            }
            renderItem={({ item: m }) => (
              <View style={{ alignItems: m.mine ? 'flex-end' : 'flex-start', gap: 3 }}>
                <View
                  style={{
                    maxWidth: '82%',
                    backgroundColor: m.mine ? c.accent : c.surface,
                    borderRadius: radius.lg,
                    borderBottomRightRadius: m.mine ? 6 : radius.lg,
                    borderBottomLeftRadius: m.mine ? radius.lg : 6,
                    paddingHorizontal: space.md,
                    paddingVertical: 10,
                    borderWidth: m.mine ? 0 : 1,
                    borderColor: c.border,
                  }}>
                  <T style={{ color: m.mine ? c.accentText : c.text }}>{m.body}</T>
                </View>
                {m.flagged ? (
                  <T v="caption" color="danger">
                    This looks like a request to pay outside Servhive. Don't. It isn't protected.
                  </T>
                ) : null}
                <T v="caption">{ago(m.createdAt)}</T>
              </View>
            )}
            ListEmptyComponent={
              <T v="small" color="muted" style={{ textAlign: 'center', marginVertical: space.xl }}>
                Say hello and describe the job.
              </T>
            }
          />
        )}
        {send.error ? (
          <View style={{ paddingHorizontal: space.lg }}>
            <Notice tone="danger">{send.error}</Notice>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: space.sm,
            paddingHorizontal: space.md,
            paddingTop: space.sm,
            paddingBottom: Math.max(insets.bottom, space.sm),
            borderTopWidth: 1,
            borderTopColor: c.border,
            backgroundColor: c.surface,
          }}>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write a message"
            placeholderTextColor={c.faint}
            multiline
            maxLength={2000}
            style={{
              flex: 1,
              maxHeight: 120,
              minHeight: 42,
              fontFamily: fonts.regular,
              fontSize: 16,
              color: c.text,
              backgroundColor: c.bg,
              borderRadius: radius.lg,
              paddingHorizontal: space.md,
              paddingVertical: 10,
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send"
            onPress={onSend}
            disabled={send.pending || !body.trim()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: body.trim() ? c.accent : c.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="arrow-up" size={22} color={body.trim() ? c.accentText : c.faint} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
