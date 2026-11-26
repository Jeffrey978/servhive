import { router } from 'expo-router';
import { View } from 'react-native';

import { EscrowStrip } from '@/components/shared';
import { Button, Card, Divider, Empty, Gap, QueryView, Row, Screen, Section, Stat, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import { firstName, greeting, naira } from '@/lib/format';
import { useSession } from '@/lib/session';
import type { ClientOverview } from '@/lib/types';
import { space } from '@/theme';

/** Client home: money held, what needs a decision, and a way into the directory. Mirrors /account. */
export default function ClientHome() {
  const session = useSession();
  const q = useApi<ClientOverview>(['client', 'overview'], '/client/overview');
  const meta = useMeta();

  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <Gap size={2}>
        <T v="caption">{greeting()}</T>
        <T v="title">{firstName(session.me?.user.name ?? '')}</T>
      </Gap>
      <QueryView query={q}>
        {(d) => (
          <Gap size={space.lg}>
            <EscrowStrip label="Held in escrow" amount={d.held} note={d.activeJobs ? `${d.activeJobs} active ${d.activeJobs === 1 ? 'job' : 'jobs'}` : 'Nothing held right now'} />
            <View style={{ flexDirection: 'row', gap: space.md }}>
              <Stat label="Active jobs" value={String(d.activeJobs)} />
              <Stat label="Saved artisans" value={String(d.savedCount)} />
            </View>

            <Section title="Needs your attention">
              {d.awaiting.length + d.quotesReady.length === 0 ? (
                <Empty icon="checkmark-done-outline" title="You're all caught up" body="Quotes to accept and finished jobs to confirm appear here." />
              ) : (
                <Card style={{ paddingVertical: space.xs }}>
                  {d.awaiting.map((j, i) => (
                    <View key={j.id}>
                      {i > 0 ? <Divider /> : null}
                      <Row
                        icon="time-outline"
                        title={`Confirm ${j.serviceName}`}
                        subtitle={`${j.provider.businessName} marked it done · auto-releases in ${j.hoursLeft ?? 0}h`}
                        right={<T v="bodyStrong">{naira(j.amount)}</T>}
                        onPress={() => router.push({ pathname: '/job/[id]', params: { id: j.id } })}
                      />
                    </View>
                  ))}
                  {d.quotesReady.map((qr, i) => (
                    <View key={qr.id}>
                      {i > 0 || d.awaiting.length ? <Divider /> : null}
                      <Row
                        icon="pricetag-outline"
                        title={`Quote ready: ${qr.title}`}
                        subtitle={`${qr.provider.businessName} · accept to fund escrow`}
                        right={qr.quoteAmount ? <T v="bodyStrong">{naira(qr.quoteAmount)}</T> : null}
                        onPress={() => router.push({ pathname: '/client/jobs', params: { tab: 'quotes' } })}
                      />
                    </View>
                  ))}
                </Card>
              )}
            </Section>
          </Gap>
        )}
      </QueryView>

      <Section title="Find an artisan">
        <Button title="Search artisans" icon="search" onPress={() => router.push('/client/find')} />
        {meta.data ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
            {meta.data.categories
              .filter((c) => c.count > 0)
              .slice(0, 8)
              .map((c) => (
                <Card
                  key={c.id}
                  onPress={() => router.push({ pathname: '/client/find', params: { category: c.id } })}
                  style={{ width: '48%', flexGrow: 1, padding: space.md, gap: 2 }}>
                  <T v="bodyStrong" numberOfLines={1}>
                    {c.name}
                  </T>
                  <T v="caption">
                    {c.count} {c.count === 1 ? 'pro' : 'pros'} · from {naira(c.rateFrom)}
                  </T>
                </Card>
              ))}
          </View>
        ) : null}
      </Section>
    </Screen>
  );
}
