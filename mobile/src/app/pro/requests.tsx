import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button, Card, Chips, Empty, Gap, Notice, QueryView, Screen, StatusBadge, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date, naira } from '@/lib/format';
import type { ProRequest } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Quote requests from clients (website: /pro/requests). */
export default function ProRequests() {
  const q = useApi<{ open: ProRequest[]; closed: ProRequest[] }>(['pro', 'requests'], '/pro/requests');
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <T v="title">Requests</T>
      <Chips
        options={[
          { value: 'open', label: q.data ? `Open (${q.data.open.length})` : 'Open' },
          { value: 'closed', label: 'Closed' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'open' | 'closed')}
      />
      <QueryView query={q}>
        {(d) => {
          const rows = tab === 'open' ? d.open : d.closed;
          if (!rows.length) {
            return tab === 'open' ? (
              <Empty icon="file-tray-outline" title="No open requests" body="When a client asks for a quote it appears here. Keep your profile and photos fresh." />
            ) : (
              <Empty icon="archive-outline" title="Nothing closed yet" />
            );
          }
          return (
            <Gap size={space.md}>
              {rows.map((r) => (
                <RequestCard key={r.id} r={r} />
              ))}
            </Gap>
          );
        }}
      </QueryView>
    </Screen>
  );
}

function RequestCard({ r }: { r: ProRequest }) {
  const decline = useSubmit('pro.declineQuote');
  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="bodyStrong">{r.title}</T>
          <T v="small" color="muted">
            {r.client.name} · {r.area}
          </T>
        </View>
        <StatusBadge status={r.status} />
      </View>
      <T v="small">{r.details}</T>
      <T v="caption">
        Asked {date(r.createdAt)}
        {r.preferredDate ? ` · wants it ${date(r.preferredDate)}` : ''}
      </T>
      {r.status === 'QUOTED' && r.quoteAmount ? (
        <T v="small" color="muted">
          You quoted {naira(r.quoteAmount)}
          {r.quoteDuration ? `, ${r.quoteDuration}` : ''}. Waiting for the client.
        </T>
      ) : null}
      {decline.error ? <Notice tone="danger">{decline.error}</Notice> : null}
      {r.status === 'PENDING' ? (
        <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.xs }}>
          <Button title="Send a quote" small style={{ flex: 1 }} onPress={() => router.push({ pathname: '/manage/quote/[id]', params: { id: r.id } })} />
          <Button
            title="Decline"
            kind="secondary"
            small
            style={{ flex: 1 }}
            loading={decline.pending}
            onPress={() =>
              Alert.alert('Decline this request?', 'The client will be told you can’t take it.', [
                { text: 'Keep it', style: 'cancel' },
                { text: 'Decline', style: 'destructive', onPress: () => decline.submit({ quoteId: r.id }) },
              ])
            }
          />
        </View>
      ) : null}
    </Card>
  );
}
