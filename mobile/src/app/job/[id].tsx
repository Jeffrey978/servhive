import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';

import { Button, Card, Divider, Empty, Gap, Notice, QueryView, Row, Screen, Section, StatusBadge, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import { date, naira } from '@/lib/format';
import type { ClientJob } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { radius, space, useColors } from '@/theme';

/** One escrow job for the client: confirm and release, dispute, or review. */
export default function JobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useApi<{ held: number; jobs: ClientJob[] }>(['client', 'jobs'], '/client/jobs');
  return (
    <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) => {
          const job = d.jobs.find((j) => j.id === id);
          return job ? <Detail job={job} /> : <Empty title="Job not found" body="It may have been removed." />;
        }}
      </QueryView>
    </Screen>
  );
}

function Detail({ job }: { job: ClientJob }) {
  const c = useColors();
  const meta = useMeta();
  const release = useSubmit('client.releaseJob');
  const open = job.status === 'FUNDED' || job.status === 'AWAITING_RELEASE';
  const autoHours = meta.data?.rules.autoReleaseHours ?? 48;

  function onRelease() {
    Alert.alert('Release the payment?', `${naira(job.amount)} goes to ${job.provider.businessName}. Only do this once you're happy with the work.`, [
      { text: 'Not yet', style: 'cancel' },
      { text: 'Release', onPress: () => release.submit({ jobId: job.id }) },
    ]);
  }

  return (
    <Gap size={space.lg}>
      <Stack.Screen options={{ title: job.ref }} />
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T v="h3">{job.serviceName}</T>
            <T v="small" color="accent" onPress={() => router.push({ pathname: '/artisan/[slug]', params: { slug: job.provider.slug } })}>
              {job.provider.businessName}
            </T>
          </View>
          <StatusBadge status={job.status} />
        </View>
        <T v="title">{naira(job.amount)}</T>
        <Divider />
        <Row icon="location-outline" title={job.area} subtitle={job.address} chevron={false} />
        {job.scheduledFor ? <Row icon="calendar-outline" title={`Booked for ${date(job.scheduledFor)}`} chevron={false} /> : null}
        <Row icon="receipt-outline" title={`Funded ${date(job.createdAt)}`} subtitle={job.releasedAt ? `Released ${date(job.releasedAt)}${job.autoReleased ? ' (automatically)' : ''}` : null} chevron={false} />
      </Card>

      {job.status === 'FUNDED' ? (
        <Notice tone="info" title="Your money is safe in escrow">
          The artisan can see it's there but can't touch it. They'll mark the job done when finished, with photos.
        </Notice>
      ) : null}
      {job.status === 'AWAITING_RELEASE' ? (
        <Notice tone="accent" title={`Releases automatically in ${job.hoursLeft ?? 0}h`}>
          {`${job.provider.businessName} marked this done. Check the work, then release. If you do nothing it releases ${autoHours} hours after they marked it done. Something wrong? Open a dispute instead.`}
        </Notice>
      ) : null}
      {job.status === 'DISPUTED' ? (
        <Notice tone="danger" title="Payment frozen">
          {`Our team is reviewing this dispute and will decide within ${meta.data?.rules.disputeDecisionDays ?? 5} days.`}
        </Notice>
      ) : null}

      {job.completionPhotos.length ? (
        <Section title="Photos of the finished work">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {job.completionPhotos.map((u) => (
              <Image key={u} source={{ uri: u }} style={{ width: 220, height: 165, borderRadius: radius.md, backgroundColor: c.surface2 }} contentFit="cover" />
            ))}
          </ScrollView>
        </Section>
      ) : null}

      {release.error ? <Notice tone="danger">{release.error}</Notice> : null}
      {open ? (
        <Gap size={space.sm}>
          <Button title={`Release ${naira(job.amount)}`} onPress={onRelease} loading={release.pending} />
          <Button title="Something's wrong? Open a dispute" kind="ghost" onPress={() => router.push({ pathname: '/dispute/[jobId]', params: { jobId: job.id } })} />
        </Gap>
      ) : null}
      {job.status === 'RELEASED' && !job.review ? (
        <Button title="Leave a review" icon="star-outline" onPress={() => router.push({ pathname: '/review/[jobId]', params: { jobId: job.id, name: job.provider.businessName } })} />
      ) : null}
      {job.review ? <T v="small" color="muted">You rated this job {job.review.rating}/5. Thank you.</T> : null}
    </Gap>
  );
}
