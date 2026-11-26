import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button, Field, Gap, Notice, Screen, Select, T } from '@/components/ui';
import { useMeta } from '@/lib/api';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

/** Freeze the payment and ask Servhive to decide. */
export default function Dispute() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const meta = useMeta();
  const { submit, pending, error } = useSubmit('client.disputeJob');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <Screen keyboard>
      <Gap size={space.xs}>
        <T v="h2">Open a dispute</T>
        <T v="small" color="muted">
          Opening a dispute freezes the payment. Our team reviews both sides and decides within {meta.data?.rules.disputeDecisionDays ?? 5} days.
        </T>
      </Gap>
      <Select label="What went wrong?" value={reason} onChange={setReason} options={(meta.data?.reportReasons ?? []).map((r) => ({ value: r, label: r }))} />
      <Field label="Details" value={notes} onChangeText={setNotes} multiline placeholder="Tell us what went wrong in a sentence or two." maxLength={2000} />
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Open dispute" kind="danger" loading={pending} onPress={() => submit({ jobId, reason, notes }, () => router.back())} />
    </Screen>
  );
}
