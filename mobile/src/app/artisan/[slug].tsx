import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Avatar, Badge, Button, Card, Divider, Gap, Notice, QueryView, Row, Screen, Section, Stars, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date, naira, priceLabel } from '@/lib/format';
import type { ArtisanProfile } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { radius, space, useColors } from '@/theme';
import { SkeletonProfile } from '@/components/skeleton';

/** An artisan's profile, with hire actions for clients (website: /artisans/[slug]). */
export default function ArtisanScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const q = useApi<ArtisanProfile>(['artisan', slug], `/artisans/${encodeURIComponent(slug)}`);
  return (
    <>
      <Stack.Screen options={{ title: q.data?.provider.businessName ?? '' }} />
      <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
        <QueryView query={q} skeleton={<SkeletonProfile />}>{(d) => <Profile d={d} />}</QueryView>
      </Screen>
    </>
  );
}

function Profile({ d }: { d: ArtisanProfile }) {
  const c = useColors();
  const p = d.provider;
  const save = useSubmit<{ saved: boolean }>('client.toggleSaved');
  const message = useSubmit<{ conversationId: string }>('client.startConversation');
  const [photo, setPhoto] = useState<string | null>(null);

  const facts = [
    { icon: 'location-outline' as const, label: p.area },
    { icon: 'time-outline' as const, label: `Replies ${p.responseTime}` },
    ...(p.yearsExperience != null ? [{ icon: 'hammer-outline' as const, label: `${p.yearsExperience} yrs experience` }] : []),
  ];

  return (
    <Gap size={space.lg}>
      {!d.isLive ? <Notice tone="info">Preview only. This profile isn't live yet, so clients can't see it.</Notice> : null}

      <View style={{ flexDirection: 'row', gap: space.lg, alignItems: 'center' }}>
        <Avatar uri={p.imageUrl} name={p.businessName} size={84} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
            <Badge label="ID-verified" tone="success" />
            {p.boosted ? <Badge label="Featured" tone="accent" /> : null}
          </View>
          <T v="h2">{p.businessName}</T>
          <T v="small" color="muted">
            {p.category.name}
            {p.subSpecialty ? ` · ${p.subSpecialty}` : ''}
          </T>
          {p.reviewCount > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Stars value={p.ratingAvg} />
              <T v="caption">
                {p.ratingAvg.toFixed(1)} · {p.reviewCount} {p.reviewCount === 1 ? 'review' : 'reviews'}
              </T>
            </View>
          ) : (
            <T v="caption">No reviews yet</T>
          )}
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
        {facts.map((f) => (
          <View key={f.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name={f.icon} size={15} color={c.muted} />
            <T v="small" color="muted">
              {f.label}
            </T>
          </View>
        ))}
      </View>

      {d.canHire ? (
        <Gap size={space.sm}>
          <Button title={`Request a quote · from ${naira(p.startingPrice)}`} onPress={() => router.push({ pathname: '/request/[providerId]', params: { providerId: p.id, name: p.businessName, area: d.defaultArea } })} />
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button
              title="Message"
              kind="secondary"
              icon="chatbubble-outline"
              style={{ flex: 1 }}
              loading={message.pending}
              onPress={() => message.submit({ providerId: p.id }, (res) => res.data && router.push({ pathname: '/thread/[id]', params: { id: res.data.conversationId } }))}
            />
            <Button
              title={d.saved ? 'Saved' : 'Save'}
              kind="secondary"
              icon={d.saved ? 'heart' : 'heart-outline'}
              style={{ flex: 1 }}
              loading={save.pending}
              onPress={() => save.submit({ providerId: p.id })}
            />
          </View>
          {save.error || message.error ? <Notice tone="danger">{save.error ?? message.error}</Notice> : null}
        </Gap>
      ) : null}

      {p.bio ? (
        <Section title="About">
          <T>{p.bio}</T>
          {p.areasCovered.length ? <T v="small" color="muted">Covers {p.areasCovered.join(', ')}</T> : null}
        </Section>
      ) : null}

      {p.services.length ? (
        <Section title="Services">
          <Card style={{ paddingVertical: space.xs }}>
            {p.services.map((s, i) => (
              <View key={s.id}>
                {i > 0 ? <Divider /> : null}
                <Row
                  title={s.name}
                  subtitle={priceLabel(s)}
                  right={
                    d.canHire && s.priceType === 'FIXED' ? (
                      <Button
                        title="Book"
                        small
                        onPress={() =>
                          router.push({ pathname: '/book/[serviceId]', params: { serviceId: s.id, name: s.name, price: String(s.price), provider: p.businessName, area: d.defaultArea } })
                        }
                      />
                    ) : null
                  }
                />
              </View>
            ))}
          </Card>
          {d.canHire ? <T v="caption">Fixed-price services can be booked straight into escrow. Others need a quote first.</T> : null}
        </Section>
      ) : null}

      {p.workPhotos.length ? (
        <Section title="Work">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm }}>
            {p.workPhotos.map((w) => (
              <Pressable key={w.id} onPress={() => setPhoto(photo === w.id ? null : w.id)} style={{ width: 200, gap: 4 }}>
                <Image source={{ uri: w.url }} style={{ width: 200, height: 150, borderRadius: radius.md, backgroundColor: c.surface2 }} contentFit="cover" />
                <T v="caption" numberOfLines={photo === w.id ? undefined : 1}>
                  {w.caption}
                  {w.area ? ` · ${w.area}` : ''}
                </T>
              </Pressable>
            ))}
          </ScrollView>
        </Section>
      ) : null}

      <Section title={`Reviews${p.reviewCount ? ` (${p.reviewCount})` : ''}`}>
        {p.reviews.length === 0 ? (
          <T v="small" color="muted">
            Reviews appear after a job is paid out through escrow.
          </T>
        ) : (
          <Card style={{ gap: space.md }}>
            {p.reviews.map((r, i) => (
              <View key={r.id} style={{ gap: 4 }}>
                {i > 0 ? <Divider /> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: i > 0 ? space.sm : 0 }}>
                  <T v="bodyStrong">{r.authorName}</T>
                  <Stars value={r.rating} size={12} />
                </View>
                <T v="small">{r.text}</T>
                <T v="caption">
                  {r.area ? `${r.area} · ` : ''}
                  {date(r.createdAt)}
                </T>
              </View>
            ))}
          </Card>
        )}
      </Section>

      {d.canHire ? (
        <Button
          title="Report this artisan"
          kind="ghost"
          icon="flag-outline"
          small
          onPress={() => router.push({ pathname: '/report/[providerId]', params: { providerId: p.id, name: p.businessName } })}
        />
      ) : null}
    </Gap>
  );
}
