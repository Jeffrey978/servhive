import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button, Card, Divider, Empty, Gap, Notice, QueryView, Row, Screen, Section, StatusBadge, T } from '@/components/ui';
import { errorMessage, useApi, useMeta } from '@/lib/api';
import { date, naira } from '@/lib/format';
import { pickImage, type PickedImage } from '@/lib/images';
import type { ProJob } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { radius, space, useColors } from '@/theme';

const MAX_PHOTOS = 6;
const MAX_TOTAL = 4_000_000; // Vercel caps a request at ~4.5MB

/** One job for the artisan; mark it done with photos of the finished work. */
export default function ProJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useApi<{ active: ProJob[]; done: ProJob[] }>(['pro', 'jobs'], '/pro/jobs');
  return (
    <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) => {
          const job = [...d.active, ...d.done].find((j) => j.id === id);
          return job ? <Detail job={job} /> : <Empty title="Job not found" />;
        }}
      </QueryView>
    </Screen>
  );
}

function Detail({ job }: { job: ProJob }) {
  const c = useColors();
  const meta = useMeta();
  const complete = useSubmit('pro.markJobComplete');
  const [photos, setPhotos] = useState<PickedImage[]>([]);
  const [pickError, setPickError] = useState<string | null>(null);
  const total = photos.reduce((s, p) => s + p.dataUrl.length, 0);

  async function add(source: 'camera' | 'library') {
    setPickError(null);
    try {
      const img = await pickImage(source, { maxWidth: 1024 });
      if (img) setPhotos((p) => [...p, img].slice(0, MAX_PHOTOS));
    } catch (e) {
      setPickError(errorMessage(e));
    }
  }

  function onComplete() {
    if (total > MAX_TOTAL) {
      setPickError('Those photos are too large to send together. Remove one and try again.');
      return;
    }
    complete.submit({ jobId: job.id, photos: photos.map((p) => p.dataUrl) }, () => setPhotos([]));
  }

  return (
    <Gap size={space.lg}>
      <Stack.Screen options={{ title: job.ref }} />
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T v="h3">{job.serviceName}</T>
            <T v="small" color="muted">
              For {job.client.name}
            </T>
          </View>
          <StatusBadge status={job.status} />
        </View>
        <T v="title">{naira(job.payoutAmount)}</T>
        <T v="caption">You receive the full amount: no commission.</T>
        <Divider />
        <Row icon="location-outline" title={job.area} subtitle={job.address} chevron={false} />
        {job.scheduledFor ? <Row icon="calendar-outline" title={`Booked for ${date(job.scheduledFor)}`} chevron={false} /> : null}
        {job.markedCompleteAt ? <Row icon="checkmark-done-outline" title={`Marked done ${date(job.markedCompleteAt)}`} chevron={false} /> : null}
        {job.releasedAt ? <Row icon="cash-outline" title={`Paid ${date(job.releasedAt)}${job.autoReleased ? ' (automatically)' : ''}`} chevron={false} /> : null}
      </Card>

      {job.status === 'FUNDED' ? (
        <Section title="Finished? Mark it done">
          <T v="small" color="muted">
            Add at least one photo of the finished work. The client then confirms, or the payment releases to you automatically {meta.data?.rules.autoReleaseHours ?? 48} hours later if there's no dispute.
          </T>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {photos.map((p, i) => (
              <View key={p.uri + i}>
                <Image source={{ uri: p.uri }} style={{ width: 110, height: 110, borderRadius: radius.md }} contentFit="cover" />
                <Pressable
                  accessibilityLabel="Remove photo"
                  onPress={() => setPhotos((all) => all.filter((_, j) => j !== i))}
                  style={{ position: 'absolute', top: 6, right: 6, backgroundColor: c.overlay, borderRadius: 14, padding: 3 }}>
                  <Ionicons name="close" size={16} color="#fff" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
          {photos.length < MAX_PHOTOS ? (
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <Button title="Take photo" kind="secondary" icon="camera-outline" small style={{ flex: 1 }} onPress={() => add('camera')} />
              <Button title="Choose photo" kind="secondary" icon="images-outline" small style={{ flex: 1 }} onPress={() => add('library')} />
            </View>
          ) : null}
          {pickError || complete.error ? <Notice tone="danger">{pickError ?? complete.error}</Notice> : null}
          <Button title="Mark job done" disabled={!photos.length} loading={complete.pending} onPress={onComplete} />
        </Section>
      ) : null}

      {job.status === 'AWAITING_RELEASE' ? (
        <Notice tone="info" title={`Pays out in ${job.hoursLeft ?? 0}h`}>
          Waiting for the client to confirm. If they don't dispute it, the payment releases to you automatically.
        </Notice>
      ) : null}
      {job.status === 'DISPUTED' ? (
        <Notice tone="danger" title="The client opened a dispute">
          {`The payment is frozen while our team reviews both sides. Check Complaints to respond. We decide within ${meta.data?.rules.disputeDecisionDays ?? 5} days.`}
        </Notice>
      ) : null}

      {job.completionPhotos.length ? (
        <Section title="Photos you sent">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {job.completionPhotos.map((u) => (
              <Image key={u} source={{ uri: u }} style={{ width: 200, height: 150, borderRadius: radius.md, backgroundColor: c.surface2 }} contentFit="cover" />
            ))}
          </ScrollView>
        </Section>
      ) : null}
    </Gap>
  );
}
