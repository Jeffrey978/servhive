import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Card, Chips, Empty, Gap, QueryView, Screen, StatusBadge, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date, naira } from '@/lib/format';
import type { ProJob } from '@/lib/types';
import { space } from '@/theme';

/** The artisan's escrow jobs (website: /pro/jobs). */
export default function ProJobs() {
  const q = useApi<{ active: ProJob[]; done: ProJob[] }>(['pro', 'jobs'], '/pro/jobs');
  const [tab, setTab] = useState<'active' | 'done'>('active');
  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <T v="title">Jobs</T>
      <Chips
        options={[
          { value: 'active', label: q.data ? `Active (${q.data.active.length})` : 'Active' },
          { value: 'done', label: 'Finished' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'active' | 'done')}
      />
      <QueryView query={q}>
        {(d) => {
          const rows = tab === 'active' ? d.active : d.done;
          if (!rows.length) return <Empty icon="briefcase-outline" title={tab === 'active' ? 'No active jobs' : 'No finished jobs yet'} body={tab === 'active' ? 'When a client accepts your quote, the money is held in escrow and the job appears here.' : undefined} />;
          return (
            <Gap size={space.md}>
              {rows.map((j) => (
                <Card key={j.id} onPress={() => router.push({ pathname: '/manage/job/[id]', params: { id: j.id } })}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T v="bodyStrong">{j.serviceName}</T>
                      <T v="small" color="muted">
                        {j.client.name} · {j.area}
                      </T>
                    </View>
                    <T v="bodyStrong">{naira(j.payoutAmount)}</T>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
                    <StatusBadge status={j.status} />
                    {j.status === 'FUNDED' ? <T v="caption" color="accent">Do the job, then mark it done</T> : null}
                    {j.status === 'AWAITING_RELEASE' ? <T v="caption">Pays out in {j.hoursLeft ?? 0}h unless disputed</T> : null}
                    {j.releasedAt ? <T v="caption">Paid {date(j.releasedAt)}</T> : null}
                  </View>
                </Card>
              ))}
            </Gap>
          );
        }}
      </QueryView>
    </Screen>
  );
}
