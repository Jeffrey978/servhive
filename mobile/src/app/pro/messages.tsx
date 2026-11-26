import { ConversationList } from '@/components/shared';
import { QueryView, Screen, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import type { Conversation } from '@/lib/types';

/** Artisan inbox (website: /pro/messages). */
export default function ProMessages() {
  const q = useApi<{ conversations: Conversation[] }>(['messages'], '/messages');
  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <T v="title">Messages</T>
      <QueryView query={q}>{(d) => <ConversationList items={d.conversations} />}</QueryView>
    </Screen>
  );
}
