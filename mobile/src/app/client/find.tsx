import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { ProviderCardView } from '@/components/shared';
import { Chips, Empty, Gap, QueryView, Screen, Select, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import type { ProviderCard } from '@/lib/types';
import { fonts, radius, space, useColors } from '@/theme';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviewed' },
  { value: 'price', label: 'Lowest price' },
  { value: 'distance', label: 'Nearest' },
] as const;
type Sort = (typeof SORTS)[number]['value'];

/** The directory: same filters and ordering as the website's /artisans. */
export default function Find() {
  const c = useColors();
  const params = useLocalSearchParams<{ category?: string }>();
  const meta = useMeta();
  const [text, setText] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(params.category ?? 'all');
  const [area, setArea] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [landmark, setLandmark] = useState('');

  // A trade tapped on Home arrives as ?category=…; follow it when it changes.
  const [seenCategory, setSeenCategory] = useState(params.category);
  if (params.category !== seenCategory) {
    setSeenCategory(params.category);
    if (params.category) setCategory(params.category);
  }

  // Search after a short pause in typing.
  useEffect(() => {
    const t = setTimeout(() => setQ(text.trim()), 350);
    return () => clearTimeout(t);
  }, [text]);

  const qs = useMemo(() => {
    const s = new URLSearchParams();
    if (q) s.set('q', q);
    if (category && category !== 'all') s.set('category', category);
    if (area) s.set('area', area);
    if (sort !== 'featured') s.set('sort', sort);
    if (landmark) s.set('landmark', landmark);
    return s.toString();
  }, [q, category, area, sort, landmark]);

  const list = useApi<{ providers: ProviderCard[] }>(['artisans', qs], `/artisans${qs ? `?${qs}` : ''}`);
  const categories = [{ value: 'all', label: 'All trades' }, ...(meta.data?.categories ?? []).map((x) => ({ value: x.id, label: x.name }))];

  return (
    <Screen edges={['top']} onRefresh={() => list.refetch()} refreshing={list.isRefetching}>
      <T v="title">Find an artisan</T>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.sm,
          backgroundColor: c.surface,
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: c.border,
          paddingHorizontal: space.md,
          height: 48,
        }}>
        <Ionicons name="search" size={18} color={c.muted} />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Generator repair, braids, POP ceiling…"
          placeholderTextColor={c.faint}
          returnKeyType="search"
          autoCorrect={false}
          style={{ flex: 1, fontFamily: fonts.regular, fontSize: 16, color: c.text }}
        />
        {text ? <Ionicons name="close-circle" size={18} color={c.faint} onPress={() => setText('')} /> : null}
      </View>

      <Chips options={categories} value={category} onChange={setCategory} />

      <Gap size={space.md}>
        <Select label="Area" placeholder="Anywhere in Port Harcourt" value={area} onChange={setArea} options={[{ value: '', label: 'Anywhere' }, ...(meta.data?.areas ?? []).map((a) => ({ value: a, label: a }))]} />
        <Chips options={[...SORTS]} value={sort} onChange={setSort} />
        {sort === 'distance' ? (
          <Select
            label="Near"
            placeholder="Choose a landmark"
            value={landmark}
            onChange={setLandmark}
            options={(meta.data?.landmarks ?? []).map((l) => ({ value: l.name, label: l.shortName, meta: l.zone }))}
          />
        ) : null}
      </Gap>

      <QueryView query={list}>
        {(d) =>
          d.providers.length === 0 ? (
            <Empty icon="search-outline" title="No artisans match" body="Try another trade, area or search word." />
          ) : (
            <Gap size={space.md}>
              <T v="caption">
                {d.providers.length} {d.providers.length === 1 ? 'artisan' : 'artisans'}
              </T>
              {d.providers.map((p) => (
                <ProviderCardView key={p.id} p={p} />
              ))}
            </Gap>
          )
        }
      </QueryView>
    </Screen>
  );
}
