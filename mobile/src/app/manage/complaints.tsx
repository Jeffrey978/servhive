import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Empty, Field, Gap, Notice, QueryView, Screen, StatusBadge, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date } from '@/lib/format';
import type { Report } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

type ProReport = Report & { job: { ref: string; serviceName: string } | null };

/** Reports clients filed about the artisan, with one response each (website: /pro/complaints). */
export default function Complaints() {
  const q = useApi<{ reports: ProReport[] }>(['pro', 'complaints'], '/pro/complaints');
  return (
    <Screen keyboard onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) =>
          d.reports.length === 0 ? (
            <Empty icon="happy-outline" title="No complaints" body="If a client reports a problem you'll see it here and can respond." />
          ) : (
            <Gap size={space.md}>
              {d.reports.map((r) => (
                <ComplaintCard key={r.id} r={r} />
              ))}
            </Gap>
          )
        }
      </QueryView>
    </Screen>
  );
}

function ComplaintCard({ r }: { r: ProReport }) {
  const respond = useSubmit('pro.respondToReport');
  const [response, setResponse] = useState('');
  const canRespond = !r.artisanResponse && (r.status === 'OPEN' || r.status === 'ARTISAN_RESPONDED');
  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="bodyStrong">{r.reason}</T>
          {r.job ? (
            <T v="small" color="muted">
              {r.job.serviceName} · {r.job.ref}
            </T>
          ) : null}
        </View>
        <StatusBadge status={r.status} />
      </View>
      <T v="small">{r.notes}</T>
      <T v="caption">Filed {date(r.createdAt)}</T>
      {r.artisanResponse ? <Notice tone="info" title="Your response">{r.artisanResponse}</Notice> : null}
      {r.resolutionNote ? <Notice tone="success" title="Servhive's decision">{r.resolutionNote}</Notice> : null}
      {canRespond ? (
        <Gap>
          <Field label="Your side" value={response} onChangeText={setResponse} multiline placeholder="Explain what happened. Our team reads both sides." maxLength={1500} />
          {respond.error ? <Notice tone="danger">{respond.error}</Notice> : null}
          <Button title="Send response" small loading={respond.pending} onPress={() => respond.submit({ reportId: r.id, response })} />
        </Gap>
      ) : null}
    </Card>
  );
}
