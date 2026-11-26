import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { Button, Card, Field, Gap, Notice, QueryView, Screen, Section, Select, T } from '@/components/ui';
import { errorMessage, useApi, useMeta } from '@/lib/api';
import { pickImage, type PickedImage } from '@/lib/images';
import type { ProProfile } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { radius, space, useColors } from '@/theme';

/** Work photos on the public profile (website: the photo section of /pro/profile). Up to 24. */
export default function ManagePhotos() {
  const q = useApi<ProProfile>(['pro', 'profile'], '/pro/profile');
  return (
    <Screen keyboard onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>{(d) => <Photos d={d} />}</QueryView>
    </Screen>
  );
}

function Photos({ d }: { d: ProProfile }) {
  const c = useColors();
  const meta = useMeta();
  const add = useSubmit('pro.addWorkPhoto');
  const remove = useSubmit('pro.deleteWorkPhoto');
  const [picked, setPicked] = useState<PickedImage | null>(null);
  const [caption, setCaption] = useState('');
  const [area, setArea] = useState('');
  const [pickError, setPickError] = useState<string | null>(null);
  const min = meta.data?.rules.minWorkPhotosForReview ?? 3;

  async function choose(source: 'camera' | 'library') {
    setPickError(null);
    try {
      const img = await pickImage(source);
      if (img) setPicked(img);
    } catch (e) {
      setPickError(errorMessage(e));
    }
  }

  return (
    <Gap size={space.lg}>
      {d.photos.length < min ? (
        <Notice tone="accent">{`Add at least ${min} photos of real jobs to submit your profile for review (${d.photos.length}/${min}).`}</Notice>
      ) : null}

      <Section title="Add a photo">
        {picked ? (
          <Card>
            <Image source={{ uri: picked.uri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md }} contentFit="cover" />
            <Field label="Caption" value={caption} onChangeText={setCaption} placeholder="e.g. Rewired a 3-bedroom flat" maxLength={120} />
            <Select label="Area (optional)" value={area} onChange={setArea} options={[{ value: '', label: 'No area' }, ...(meta.data?.areas ?? []).map((a) => ({ value: a, label: a }))]} />
            {add.error ? <Notice tone="danger">{add.error}</Notice> : null}
            <View style={{ flexDirection: 'row', gap: space.sm }}>
              <Button title="Cancel" kind="secondary" small style={{ flex: 1 }} onPress={() => setPicked(null)} />
              <Button
                title="Add photo"
                small
                style={{ flex: 1 }}
                loading={add.pending}
                onPress={() =>
                  add.submit({ dataUrl: picked.dataUrl, caption, area }, () => {
                    setPicked(null);
                    setCaption('');
                    setArea('');
                  })
                }
              />
            </View>
          </Card>
        ) : (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button title="Take photo" kind="secondary" icon="camera-outline" small style={{ flex: 1 }} onPress={() => choose('camera')} />
            <Button title="Choose photo" kind="secondary" icon="images-outline" small style={{ flex: 1 }} onPress={() => choose('library')} />
          </View>
        )}
        {pickError ? <Notice tone="danger">{pickError}</Notice> : null}
      </Section>

      <Section title={`Your photos (${d.photos.length}/24)`}>
        {remove.error ? <Notice tone="danger">{remove.error}</Notice> : null}
        {d.photos.length === 0 ? (
          <T v="small" color="muted">
            No photos yet.
          </T>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
            {d.photos.map((w) => (
              <View key={w.id} style={{ width: '48%', flexGrow: 1, gap: 4 }}>
                <Image source={{ uri: w.url }} style={{ width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: c.surface2 }} contentFit="cover" />
                <Pressable
                  accessibilityLabel={`Remove ${w.caption}`}
                  onPress={() =>
                    Alert.alert('Remove this photo?', w.caption, [
                      { text: 'Keep', style: 'cancel' },
                      { text: 'Remove', style: 'destructive', onPress: () => remove.submit({ photoId: w.id }) },
                    ])
                  }
                  style={{ position: 'absolute', top: 6, right: 6, backgroundColor: c.overlay, borderRadius: 14, padding: 4 }}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </Pressable>
                <T v="caption" numberOfLines={2}>
                  {w.caption}
                </T>
              </View>
            ))}
          </View>
        )}
      </Section>
    </Gap>
  );
}
