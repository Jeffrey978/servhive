import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { DateChips } from '@/components/shared';
import { Button, Card, Field, Gap, Notice, Screen, Select, T } from '@/components/ui';
import { useMeta } from '@/lib/api';
import { naira } from '@/lib/format';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Book a fixed-price service straight into escrow (website: "Book" on a profile). */
export default function BookService() {
  const p = useLocalSearchParams<{ serviceId: string; name?: string; price?: string; provider?: string; area?: string }>();
  const meta = useMeta();
  const { submit, pending, error } = useSubmit('client.bookService');
  const [area, setArea] = useState(p.area ?? '');
  const [address, setAddress] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  return (
    <Screen keyboard>
      <Card>
        <T v="label">{p.provider}</T>
        <T v="h3">{p.name}</T>
        <T v="h2">{naira(Number(p.price))}</T>
        <T v="small" color="muted">
          Paid into escrow now. Released to the artisan only after you confirm the job is done.
        </T>
      </Card>
      <Select label="Area" value={area} onChange={setArea} options={(meta.data?.areas ?? []).map((a) => ({ value: a, label: a }))} />
      <Field label="Address" value={address} onChangeText={setAddress} placeholder="House number, street, landmark" autoComplete="street-address" />
      <Gap size={6}>
        <T v="small">When</T>
        <DateChips value={scheduledFor} onChange={setScheduledFor} />
      </Gap>
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button
        title={`Book and pay ${naira(Number(p.price))}`}
        loading={pending}
        onPress={() =>
          submit({ serviceId: p.serviceId, area, address, scheduledFor }, () => {
            router.dismissAll();
            router.push({ pathname: '/client/jobs', params: { tab: 'jobs' } });
          })
        }
      />
    </Screen>
  );
}
