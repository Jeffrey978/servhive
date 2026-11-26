import { router } from 'expo-router';
import { View } from 'react-native';

import { Card, Empty, Gap, QueryView, Screen, StatusBadge, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date } from '@/lib/format';
import type { Report } from '@/lib/types';
import { space } from '@/theme';

type ClientReport = Report & { provider: { businessName: string; slug: string }; job: { ref: string } | null };

/** Reports and disputes the client filed (website: /account/reports). */
export default function Reports() {
  const q = useApi<{ reports: ClientReport[] }>(['client', 'reports'], '/client/reports');
  return (
    <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) =>
          d.reports.length === 0 ? (
            <Empty icon="flag-outline" title="No reports" body="Reports and disputes you file appear here with their outcome." />
          ) : (
            <Gap size={space.md}>
              {d.reports.map((r) => (
                <Card key={r.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <T v="bodyStrong">{r.reason}</T>
                      <T v="small" color="accent" onPress={() => router.push({ pathname: '/artisan/[slug]', params: { slug: r.provider.slug } })}>
                        {r.provider.businessName}
                        {r.job ? ` · ${r.job.ref}` : ''}
                      </T>
                    </View>
                    <StatusBadge status={r.status} />
                  </View>
                  <T v="small" color="muted">
                    {r.notes}
                  </T>
                  {r.artisanResponse ? (
                    <T v="small">
                      <T v="small" style={{ fontWeight: '600' }}>
                        Artisan:{' '}
                      </T>
                      {r.artisanResponse}
                    </T>
                  ) : null}
                  {r.resolutionNote ? (
                    <T v="small">
                      <T v="small" style={{ fontWeight: '600' }}>
                        Servhive:{' '}
                      </T>
                      {r.resolutionNote}
                    </T>
                  ) : null}
                  <T v="caption">Filed {date(r.createdAt)}</T>
                </Card>
              ))}
            </Gap>
          )
        }
      </QueryView>
    </Screen>
  );
}
