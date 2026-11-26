import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Avatar, Button, Card, Divider, Field, Gap, Notice, QueryView, Row, Screen, Section, Select, T } from '@/components/ui';
import { errorMessage, useApi, useMeta } from '@/lib/api';
import { naira, priceLabel } from '@/lib/format';
import { pickImage } from '@/lib/images';
import type { ProProfile } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Edit the public listing and services (website: /pro/profile). Editing never changes approval status. */
export default function ManageProfile() {
  const q = useApi<ProProfile>(['pro', 'profile'], '/pro/profile');
  return (
    <Screen keyboard onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      {/* Keyed on the saved profile: after a save or refresh the form restarts from the new values. */}
      <QueryView query={q}>{(d) => <Editor key={JSON.stringify(d.profile)} d={d} />}</QueryView>
    </Screen>
  );
}

function Editor({ d }: { d: ProProfile }) {
  const meta = useMeta();
  const save = useSubmit('pro.updateProfile');
  const photo = useSubmit('pro.updatePhoto');
  const p = d.profile;
  const [businessName, setBusinessName] = useState(p.businessName);
  const [subSpecialty, setSubSpecialty] = useState(p.subSpecialty ?? '');
  const [bio, setBio] = useState(p.bio);
  const [areasCovered, setAreasCovered] = useState<string[]>(p.areasCovered);
  const [startingPrice, setStartingPrice] = useState(String(p.startingPrice));
  const [responseTime, setResponseTime] = useState(p.responseTime);
  const [yearsExperience, setYearsExperience] = useState(p.yearsExperience == null ? '' : String(p.yearsExperience));
  const [phone, setPhone] = useState(p.phone ?? '');
  const [photoError, setPhotoError] = useState<string | null>(null);

  async function changePhoto() {
    setPhotoError(null);
    try {
      const img = await pickImage('library', { maxWidth: 800 });
      if (img) await photo.submit({ dataUrl: img.dataUrl });
    } catch (e) {
      setPhotoError(errorMessage(e));
    }
  }

  return (
    <Gap size={space.lg}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
        <Avatar uri={p.imageUrl} name={p.businessName} size={76} />
        <Gap size={space.xs} style={{ flex: 1 }}>
          <T v="caption">{p.category.name}</T>
          <Button title={p.imageUrl ? 'Change photo' : 'Add a photo'} kind="secondary" small icon="camera-outline" loading={photo.pending} onPress={changePhoto} />
        </Gap>
      </View>
      {photoError || photo.error ? <Notice tone="danger">{photoError ?? photo.error}</Notice> : null}

      <Section title="Your listing">
        <Field label="Business name" value={businessName} onChangeText={setBusinessName} maxLength={80} />
        <Field label="Speciality (optional)" value={subSpecialty} onChangeText={setSubSpecialty} maxLength={80} />
        <Field label="About your work" value={bio} onChangeText={setBio} multiline maxLength={1200} hint={`${bio.length}/1,200`} />
        <Select
          label="Areas you cover"
          multiple
          values={areasCovered}
          onChangeMany={setAreasCovered}
          options={(meta.data?.areas ?? []).map((a) => ({ value: a, label: a }))}
        />
        <Field
          label="Starting price (₦)"
          value={startingPrice}
          onChangeText={setStartingPrice}
          keyboardType="number-pad"
          hint={meta.data ? `At least ${naira(meta.data.rules.minStartingPrice)}` : undefined}
        />
        <Select label="Usual response time" value={responseTime} onChange={setResponseTime} options={(meta.data?.responseTimes ?? []).map((r) => ({ value: r, label: r }))} />
        <Field label="Years of experience" value={yearsExperience} onChangeText={setYearsExperience} keyboardType="number-pad" />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" hint="Only Servhive sees this. Clients message you in the app." />
        {save.error ? <Notice tone="danger">{save.error}</Notice> : null}
        <Button
          title="Save profile"
          loading={save.pending}
          onPress={() => save.submit({ businessName, subSpecialty, bio, areasCovered, startingPrice, responseTime, yearsExperience, phone })}
        />
      </Section>

      <Section title="Services" action={<T v="small" color="accent" onPress={() => router.push('/manage/service')}>Add</T>}>
        {d.services.length === 0 ? (
          <Card>
            <T v="small" color="muted">
              List what you offer with a price. Fixed-price services can be booked straight into escrow.
            </T>
            <Button title="Add a service" small onPress={() => router.push('/manage/service')} />
          </Card>
        ) : (
          <Card style={{ paddingVertical: space.xs }}>
            {d.services.map((s, i) => (
              <View key={s.id}>
                {i > 0 ? <Divider /> : null}
                <Row title={s.name} subtitle={priceLabel(s)} onPress={() => router.push({ pathname: '/manage/service', params: { id: s.id } })} />
              </View>
            ))}
          </Card>
        )}
      </Section>
    </Gap>
  );
}
