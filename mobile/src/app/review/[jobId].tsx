import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button, Field, Gap, Notice, Screen, StarInput, T } from '@/components/ui';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** One review per paid-out job. */
export default function Review() {
  const { jobId, name } = useLocalSearchParams<{ jobId: string; name?: string }>();
  const { submit, pending, error } = useSubmit('client.submitReview');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  return (
    <Screen keyboard>
      <Gap size={space.xs}>
        <T v="h2">How did {name ?? 'it'} go?</T>
        <T v="small" color="muted">
          Your review appears on the artisan's profile.
        </T>
      </Gap>
      <StarInput value={rating} onChange={setRating} />
      <Field label="Your review" value={text} onChangeText={setText} multiline placeholder="What went well? Would you hire them again?" maxLength={1000} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Post review" loading={pending} onPress={() => submit({ jobId, rating: rating ? String(rating) : '', text }, () => router.back())} />
    </Screen>
  );
}
