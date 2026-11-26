import { ConversationList } from '@/components/shared';
import { QueryView, Screen, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import type { Conversation } from '@/lib/types';
import { SkeletonRows } from '@/components/skeleton';

/** Client inbox (website: /account/messages). */
export default function ClientMessages() {
  const q = useApi<{ conversations: Conversation[] }>(['messages'], '/messages');
  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <T v="title">Messages</T>
      <QueryView query={q} skeleton={<SkeletonRows />}>{(d) => <ConversationList items={d.conversations} />}</QueryView>
    </Screen>
  );
}
