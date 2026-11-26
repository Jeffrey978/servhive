import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { DateChips } from '@/components/shared';
import { Button, Field, Gap, Notice, Screen, Select, T } from '@/components/ui';
import { useMeta } from '@/lib/api';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Ask an artisan for a quote (website: the quote form on /artisans/[slug]). */
export default function RequestQuote() {
  const { providerId, name, area: defaultArea } = useLocalSearchParams<{ providerId: string; name?: string; area?: string }>();
  const meta = useMeta();
  const { submit, pending, error } = useSubmit('client.requestQuote');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [area, setArea] = useState(defaultArea ?? '');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  return (
    <Screen keyboard>
      <Gap size={space.xs}>
        <T v="h2">Ask {name ?? 'this artisan'} for a quote</T>
        <T v="small" color="muted">
          They reply with a fixed price. Nothing is paid until you accept it.
        </T>
      </Gap>
      <Field label="What do you need done?" value={title} onChangeText={setTitle} placeholder="e.g. Fix generator that won't start" maxLength={100} />
      <Field label="Details" value={details} onChangeText={setDetails} multiline placeholder="Describe the job, the brand or model, and anything they should bring." maxLength={2000} />
      <Select label="Area" value={area} onChange={setArea} options={(meta.data?.areas ?? []).map((a) => ({ value: a, label: a }))} />
      <Field label="Address" value={address} onChangeText={setAddress} placeholder="House number, street, landmark" autoComplete="street-address" />
      <Gap size={6}>
        <T v="small">Preferred day</T>
        <DateChips value={preferredDate} onChange={setPreferredDate} />
      </Gap>
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Send request" loading={pending} onPress={() => submit({ providerId, title, details, area, address, preferredDate }, () => router.back())} />
    </Screen>
  );
}
