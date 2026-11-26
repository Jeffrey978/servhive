import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { EscrowStrip } from '@/components/shared';
import { Button, Card, Chips, Empty, Gap, Notice, QueryView, Screen, StatusBadge, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date, naira } from '@/lib/format';
import type { ClientJob, Quote } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

type ClientQuote = Quote & { provider: { businessName: string; slug: string; imageUrl: string | null }; job: { ref: string } | null };

/** Jobs & escrow and Quotes, as on the website's /account/jobs and /account/quotes. */
export default function ClientJobs() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<'jobs' | 'quotes'>(params.tab === 'quotes' ? 'quotes' : 'jobs');
  // Links from Home open a given tab via ?tab=…; follow it when it changes.
  const [seenTab, setSeenTab] = useState(params.tab);
  if (params.tab !== seenTab) {
    setSeenTab(params.tab);
    if (params.tab === 'quotes' || params.tab === 'jobs') setTab(params.tab);
  }

  const jobs = useApi<{ held: number; jobs: ClientJob[] }>(['client', 'jobs'], '/client/jobs');
  const quotes = useApi<{ quotes: ClientQuote[] }>(['client', 'quotes'], '/client/quotes');
  const waiting = quotes.data?.quotes.filter((x) => x.status === 'QUOTED').length ?? 0;
  const active = tab === 'jobs' ? jobs : quotes;

  return (
    <Screen edges={['top']} onRefresh={() => active.refetch()} refreshing={active.isRefetching}>
      <T v="title">Jobs</T>
      <Chips
        options={[
          { value: 'jobs', label: 'Jobs & escrow' },
          { value: 'quotes', label: waiting ? `Quotes (${waiting} ready)` : 'Quotes' },
        ]}
        value={tab}
        onChange={(v) => setTab(v as 'jobs' | 'quotes')}
      />
      {tab === 'jobs' ? (
        <QueryView query={jobs}>
          {(d) => (
            <Gap size={space.md}>
              <EscrowStrip label="Held in escrow" amount={d.held} note="Released to the artisan only when you confirm the job is done." />
              {d.jobs.length === 0 ? (
                <Empty icon="briefcase-outline" title="No jobs yet" body="Accept a quote or book a fixed-price service and it appears here." />
              ) : (
                d.jobs.map((j) => <JobCard key={j.id} job={j} />)
              )}
            </Gap>
          )}
        </QueryView>
      ) : (
        <QueryView query={quotes}>
          {(d) =>
            d.quotes.length === 0 ? (
              <Empty icon="pricetag-outline" title="No quote requests" body="Ask an artisan for a quote from their profile." />
            ) : (
              <Gap size={space.md}>
                {d.quotes.map((x) => (
                  <QuoteCard key={x.id} quote={x} />
                ))}
              </Gap>
            )
          }
        </QueryView>
      )}
    </Screen>
  );
}

function JobCard({ job }: { job: ClientJob }) {
  return (
    <Card onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="bodyStrong">{job.serviceName}</T>
          <T v="small" color="muted">
            {job.provider.businessName} · {job.ref}
          </T>
        </View>
        <T v="bodyStrong">{naira(job.amount)}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
        <StatusBadge status={job.status} />
        {job.status === 'AWAITING_RELEASE' ? <T v="caption">Auto-releases in {job.hoursLeft ?? 0}h</T> : null}
        {job.status === 'RELEASED' && !job.review ? <T v="caption" color="accent">Leave a review</T> : null}
      </View>
    </Card>
  );
}

function QuoteCard({ quote }: { quote: ClientQuote }) {
  const accept = useSubmit('client.acceptQuote');
  const cancel = useSubmit('client.cancelQuote');
  const error = accept.error ?? cancel.error;

  function onAccept() {
    Alert.alert(
      'Accept and fund escrow?',
      `${naira(quote.quoteAmount)} goes into escrow. ${quote.provider.businessName} is paid only after you confirm the job is done.`,
      [
        { text: 'Not yet', style: 'cancel' },
        { text: 'Accept', onPress: () => accept.submit({ quoteId: quote.id }, () => router.push({ pathname: '/client/jobs', params: { tab: 'jobs' } })) },
      ],
    );
  }

  function onCancel() {
    const quoted = quote.status === 'QUOTED';
    Alert.alert(quoted ? 'Decline this quote?' : 'Cancel this request?', 'The artisan will see it was closed.', [
      { text: 'Keep it', style: 'cancel' },
      { text: quoted ? 'Decline' : 'Cancel request', style: 'destructive', onPress: () => cancel.submit({ quoteId: quote.id }) },
    ]);
  }

  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <T v="bodyStrong">{quote.title}</T>
          <T v="small" color="muted" onPress={() => router.push({ pathname: '/artisan/[slug]', params: { slug: quote.provider.slug } })}>
            {quote.provider.businessName}
          </T>
        </View>
        <StatusBadge status={quote.status} />
      </View>
      <T v="small" color="muted" numberOfLines={3}>
        {quote.details}
      </T>
      <T v="caption">
        {quote.area} · requested {date(quote.createdAt)}
        {quote.preferredDate ? ` · for ${date(quote.preferredDate)}` : ''}
      </T>
      {quote.status === 'QUOTED' && quote.quoteAmount ? (
        <Gap size={space.sm} style={{ marginTop: space.xs }}>
          <T v="h2">{naira(quote.quoteAmount)}</T>
          {quote.quoteDuration ? <T v="small">Takes {quote.quoteDuration}</T> : null}
          {quote.quoteNotes ? <T v="small" color="muted">"{quote.quoteNotes}"</T> : null}
        </Gap>
      ) : null}
      {quote.job ? <T v="caption">Escrow job {quote.job.ref}</T> : null}
      {error ? <Notice tone="danger">{error}</Notice> : null}
      {quote.status === 'QUOTED' || quote.status === 'PENDING' ? (
        <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.xs }}>
          {quote.status === 'QUOTED' ? <Button title="Accept & pay" small onPress={onAccept} loading={accept.pending} style={{ flex: 1 }} /> : null}
          <Button title={quote.status === 'QUOTED' ? 'Decline' : 'Cancel request'} kind="secondary" small onPress={onCancel} loading={cancel.pending} style={{ flex: 1 }} />
        </View>
      ) : null}
    </Card>
  );
}
