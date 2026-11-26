import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button, Card, Empty, Field, Gap, Notice, QueryView, Screen, T } from '@/components/ui';
import { useApi } from '@/lib/api';
import { date } from '@/lib/format';
import type { ProRequest } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';
import { SkeletonForm } from '@/components/skeleton';

/** Reply to a request with a fixed price (website: the quote form on /pro/requests). */
export default function SendQuote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useApi<{ open: ProRequest[]; closed: ProRequest[] }>(['pro', 'requests'], '/pro/requests');
  const { submit, pending, error } = useSubmit('pro.sendQuote');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Screen keyboard>
      <QueryView query={q} skeleton={<SkeletonForm />}>
        {(d) => {
          const r = d.open.find((x) => x.id === id);
          if (!r) return <Empty title="This request is closed" />;
          return (
            <Gap size={space.lg}>
              <Card>
                <T v="label">{r.client.name}</T>
                <T v="h3">{r.title}</T>
                <T v="small">{r.details}</T>
                <T v="caption">
                  {r.area} · {r.address}
                  {r.preferredDate ? ` · wants it ${date(r.preferredDate)}` : ''}
                </T>
              </Card>
              <Field label="Your price (₦)" value={amount} onChangeText={setAmount} keyboardType="number-pad" hint="The full price for the job. You keep 100% of it." />
              <Field label="How long will it take?" value={duration} onChangeText={setDuration} placeholder="e.g. 2 days" maxLength={60} />
              <Field label="Notes (optional)" value={notes} onChangeText={setNotes} multiline placeholder="What's included, materials, anything the client should know." maxLength={1000} />
              {error ? <Notice tone="danger">{error}</Notice> : null}
              <Button title="Send quote" loading={pending} onPress={() => submit({ quoteId: r.id, amount, duration, notes }, () => router.back())} />
            </Gap>
          );
        }}
      </QueryView>
    </Screen>
  );
}
