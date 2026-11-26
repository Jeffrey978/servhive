import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Field, Gap, Notice, QueryView, Screen, Select } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import type { PriceType, ProProfile, Service } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';
import { SkeletonForm } from '@/components/skeleton';

/** Add or edit one service (website: the service editor on /pro/profile). */
export default function ManageService() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const q = useApi<ProProfile>(['pro', 'profile'], '/pro/profile');
  return (
    <Screen keyboard>
      <Stack.Screen options={{ title: id ? 'Edit service' : 'New service' }} />
      <QueryView query={q} skeleton={<SkeletonForm />}>{(d) => <Form key={id ?? 'new'} service={d.services.find((s) => s.id === id) ?? null} />}</QueryView>
    </Screen>
  );
}

function Form({ service }: { service: Service | null }) {
  const meta = useMeta();
  const save = useSubmit('pro.saveService');
  const remove = useSubmit('pro.deleteService');
  const [name, setName] = useState(service?.name ?? '');
  const [price, setPrice] = useState(service ? String(service.price) : '');
  const [priceType, setPriceType] = useState<PriceType>(service?.priceType ?? 'FIXED');
  const [unitLabel, setUnitLabel] = useState(service?.unitLabel ?? '');

  return (
    <Gap size={space.lg}>
      <Field label="Service name" value={name} onChangeText={setName} placeholder="e.g. Generator servicing" maxLength={80} />
      <Field label="Price (₦)" value={price} onChangeText={setPrice} keyboardType="number-pad" />
      <Select label="How it's priced" value={priceType} onChange={setPriceType} options={(meta.data?.priceTypes ?? []).map((p) => ({ value: p.value, label: p.label }))} />
      {priceType === 'PER_UNIT' ? <Field label="Unit" value={unitLabel} onChangeText={setUnitLabel} placeholder="e.g. room, door, garment" maxLength={30} /> : null}
      {save.error || remove.error ? <Notice tone="danger">{save.error ?? remove.error}</Notice> : null}
      <Button
        title="Save service"
        loading={save.pending}
        onPress={() => save.submit({ serviceId: service?.id, name, price, priceType, unitLabel }, () => router.back())}
      />
      {service ? (
        <Button
          title="Remove service"
          kind="danger"
          loading={remove.pending}
          onPress={() =>
            Alert.alert('Remove this service?', service.name, [
              { text: 'Keep', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: () => remove.submit({ serviceId: service.id }, () => router.back()) },
            ])
          }
        />
      ) : null}
    </Gap>
  );
}
