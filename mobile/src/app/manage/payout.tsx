import { useState } from 'react';
import { View } from 'react-native';

import { Badge, Button, Card, Field, Gap, Notice, QueryView, Screen, Section, Select, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';
import { SkeletonForm } from '@/components/skeleton';

type Payout = { account: null | { bankCode: string; bankName: string; accountNumberMasked: string; accountName: string; verified: boolean } };

/** Where payouts go (website: /pro/payout). The full number is never sent back to the phone. */
export default function PayoutScreen() {
  const q = useApi<Payout>(['pro', 'payout'], '/pro/payout');
  const meta = useMeta();
  const save = useSubmit('pro.savePayout');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [editing, setEditing] = useState(false);

  return (
    <Screen keyboard onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q} skeleton={<SkeletonForm />}>
        {(d) => (
          <Gap size={space.lg}>
            {d.account && !editing ? (
              <Card>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <T v="label">{d.account.bankName}</T>
                  <Badge label={d.account.verified ? 'Verified' : 'Pending verification'} tone={d.account.verified ? 'success' : 'outline'} />
                </View>
                <T v="title" style={{ letterSpacing: 2 }}>
                  {d.account.accountNumberMasked}
                </T>
                <T v="small" color="muted">
                  {d.account.accountName}
                </T>
                <Button title="Change account" kind="secondary" small onPress={() => setEditing(true)} />
              </Card>
            ) : (
              <Section title={d.account ? 'New payout account' : 'Add your payout account'}>
                <Notice tone="info">The account name must match the name on your ID. Our team checks it before your first payout.</Notice>
                <Select label="Bank" value={bankCode} onChange={setBankCode} options={(meta.data?.banks ?? []).map((b) => ({ value: b.code, label: b.name }))} />
                <Field label="Account number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" maxLength={10} hint="10 digits" />
                <Field label="Account name" value={accountName} onChangeText={setAccountName} autoCapitalize="words" maxLength={80} />
                {save.error ? <Notice tone="danger">{save.error}</Notice> : null}
                <Button
                  title="Save payout account"
                  loading={save.pending}
                  onPress={() =>
                    save.submit({ bankCode, accountNumber, accountName }, () => {
                      setEditing(false);
                      setAccountNumber('');
                    })
                  }
                />
                {d.account ? <Button title="Cancel" kind="ghost" onPress={() => setEditing(false)} /> : null}
              </Section>
            )}
          </Gap>
        )}
      </QueryView>
    </Screen>
  );
}
