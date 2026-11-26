import { router } from 'expo-router';

import { ProviderCardView } from '@/components/shared';
import { Button, Empty, Gap, QueryView, Screen } from '@/components/ui';
import { useApi } from '@/lib/api';
import type { ProviderCard } from '@/lib/types';
import { space } from '@/theme';

/** Artisans the client saved (website: /account/saved). */
export default function Saved() {
  const q = useApi<{ providers: ProviderCard[] }>(['client', 'saved'], '/client/saved');
  return (
    <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) =>
          d.providers.length === 0 ? (
            <Empty
              icon="heart-outline"
              title="Nothing saved yet"
              body="Tap Save on an artisan's profile to keep them here."
              action={<Button title="Find artisans" small onPress={() => router.push('/client/find')} />}
            />
          ) : (
            <Gap size={space.md}>
              {d.providers.map((p) => (
                <ProviderCardView key={p.id} p={p} />
              ))}
            </Gap>
          )
        }
      </QueryView>
    </Screen>
  );
}
