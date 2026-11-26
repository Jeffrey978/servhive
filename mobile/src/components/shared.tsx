import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Avatar, Badge, Card, Chips, Divider, Empty, Row, Stars, T } from '@/components/ui';
import { ago, lagosToday, naira } from '@/lib/format';
import type { Conversation, ProviderCard } from '@/lib/types';
import { radius, space, useColors } from '@/theme';

/** One artisan in a list (directory, saved). Tapping opens the profile. */
export function ProviderCardView({ p }: { p: ProviderCard }) {
  const c = useColors();
  return (
    <Card onPress={() => router.push({ pathname: '/artisan/[slug]', params: { slug: p.slug } })} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
      <Avatar uri={p.imageUrl} name={p.businessName} size={58} />
      <View style={{ flex: 1, gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
          <T v="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
            {p.businessName}
          </T>
          <Ionicons name="shield-checkmark" size={15} color={c.success} accessibilityLabel="ID-verified" />
        </View>
        <T v="small" color="muted" numberOfLines={1}>
          {p.category.name}
          {p.subSpecialty ? ` · ${p.subSpecialty}` : ''}
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
          {p.reviewCount > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Stars value={p.ratingAvg} size={12} />
              <T v="caption">({p.reviewCount})</T>
            </View>
          ) : (
            <T v="caption">New</T>
          )}
          <T v="caption">· {p.area}</T>
          {p.distanceKm != null ? <T v="caption">· {p.distanceKm.toFixed(1)} km</T> : null}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {p.boosted ? <Badge label="Featured" tone="accent" /> : null}
        <T v="caption">from</T>
        <T v="bodyStrong">{naira(p.startingPrice)}</T>
      </View>
    </Card>
  );
}

/** Inbox for either side. */
export function ConversationList({ items }: { items: Conversation[] }) {
  if (!items.length) {
    return <Empty icon="chatbubbles-outline" title="No messages yet" body="Conversations with artisans and clients show up here." />;
  }
  return (
    <Card style={{ paddingVertical: space.xs }}>
      {items.map((cv, i) => (
        <View key={cv.id}>
          {i > 0 ? <Divider /> : null}
          <Row
            left={<Avatar uri={cv.counterpart.avatarUrl} name={cv.counterpart.name} />}
            title={cv.counterpart.name}
            subtitle={cv.lastMessage ? `${cv.lastMessage.mine ? 'You: ' : ''}${cv.lastMessage.body}` : 'No messages yet'}
            right={<T v="caption">{ago(cv.lastMessage?.createdAt ?? cv.updatedAt)}</T>}
            onPress={() => router.push({ pathname: '/thread/[id]', params: { id: cv.id } })}
            chevron={false}
          />
        </View>
      ))}
    </Card>
  );
}

/** "No preference" plus the next 14 days, as the YYYY-MM-DD strings the website accepts. */
export function DateChips({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const options = [{ value: '', label: 'No preference' }];
  for (let i = 0; i < 14; i++) {
    const iso = lagosToday(i);
    const d = new Date(`${iso}T12:00:00Z`);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${DAYS[d.getUTCDay()]} ${d.getUTCDate()}`;
    options.push({ value: iso, label });
  }
  return <Chips options={options} value={value} onChange={onChange} />;
}

/** The orange "money held" strip used on client and artisan homes. */
export function EscrowStrip({ label, amount, note }: { label: string; amount: number; note: string }) {
  const c = useColors();
  return (
    <View style={{ backgroundColor: c.accent, borderRadius: radius.lg, padding: space.lg, gap: 4 }}>
      <T v="label" style={{ color: c.accentText, opacity: 0.85 }}>
        {label}
      </T>
      <T v="title" style={{ color: c.accentText }}>
        {naira(amount)}
      </T>
      <T v="small" style={{ color: c.accentText, opacity: 0.9 }}>
        {note}
      </T>
    </View>
  );
}

/** A small tappable link row used in "More"/"Account" menus. */
export function MenuLink({ icon, title, subtitle, onPress }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string; subtitle?: string; onPress: () => void }) {
  return <Row icon={icon} title={title} subtitle={subtitle} onPress={onPress} />;
}
