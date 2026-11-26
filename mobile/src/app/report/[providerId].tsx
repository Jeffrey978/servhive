import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button, Field, Gap, Notice, Screen, Select, T } from '@/components/ui';
import { useMeta } from '@/lib/api';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Report an artisan to the Servhive team. */
export default function ReportArtisan() {
  const { providerId, name } = useLocalSearchParams<{ providerId: string; name?: string }>();
  const meta = useMeta();
  const { submit, pending, error } = useSubmit('client.report');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <Screen keyboard>
      <Gap size={space.xs}>
        <T v="h2">Report {name ?? 'this artisan'}</T>
        <T v="small" color="muted">
          Our team reviews every report. The artisan is told and can respond.
        </T>
      </Gap>
      <Select label="What happened?" value={reason} onChange={setReason} options={(meta.data?.reportReasons ?? []).map((r) => ({ value: r, label: r }))} />
      <Field label="Details" value={notes} onChangeText={setNotes} multiline placeholder="Tell us what happened in a sentence or two." maxLength={2000} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Send report" loading={pending} onPress={() => submit({ providerId, reason, notes }, () => router.back())} />
    </Screen>
  );
}
