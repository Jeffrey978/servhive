import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Badge, Button, Card, Divider, Empty, Gap, Notice, QueryView, Row, Screen, Section, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import { date, naira } from '@/lib/format';
import type { Billing, Boost, ProviderStatus } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space } from '@/theme';

type BillingData = { billing: Billing; boost: Boost; status: ProviderStatus; receipts: { id: string; ref: string; description: string; amount: number; status: string; createdAt: string }[] };

/** Membership and boost (website: /pro/billing). Payments are in test mode, as on the website. */
export default function BillingScreen() {
  const q = useApi<BillingData>(['pro', 'billing'], '/pro/billing');
  const meta = useMeta();
  const pay = useSubmit('pro.paySubscription');
  const boost = useSubmit('pro.buyBoost');
  const [showAll, setShowAll] = useState(false);
  const monthly = meta.data?.rules.monthlySubscription ?? 2000;
  const boostPrice = meta.data?.rules.boostPricePerWeek ?? 1500;

  return (
    <Screen onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>
        {(d) => {
          const b = d.billing;
          return (
            <Gap size={space.lg}>
              <Notice tone="info" title="Test mode">
                No real money moves yet. Payments here are recorded so the flow can be tried end to end.
              </Notice>

              <Section title="Membership">
                <Card>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <T v="h3">{b.state === 'trial' ? 'Free month' : b.state === 'paid' ? 'Active' : 'Payment due'}</T>
                    <Badge label={b.state === 'due' ? 'Hidden from search' : 'Listed'} tone={b.state === 'due' ? 'danger' : 'success'} />
                  </View>
                  <T v="small" color="muted">
                    {b.state === 'trial'
                      ? `${b.trialDaysLeft} ${b.trialDaysLeft === 1 ? 'day' : 'days'} left of your free month.`
                      : b.state === 'paid'
                        ? `Paid until ${date(b.paidUntil)}.`
                        : 'Your profile is hidden from clients until you pay. Your account and reviews are kept.'}
                  </T>
                  <T v="small">
                    {naira(monthly)} a month. You keep 100% of every job, with no commission.
                  </T>
                  {pay.error ? <Notice tone="danger">{pay.error}</Notice> : null}
                  <Button
                    title={`Pay ${naira(monthly)} for 1 month`}
                    loading={pay.pending}
                    onPress={() =>
                      Alert.alert(`Pay ${naira(monthly)}?`, 'Adds one month to your membership (test mode).', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Pay', onPress: () => pay.submit({}) },
                      ])
                    }
                  />
                </Card>
              </Section>

              <Section title="Boost">
                <Card>
                  <T v="h3">{d.boost.active ? `Boosted · ${d.boost.daysLeft} ${d.boost.daysLeft === 1 ? 'day' : 'days'} left` : 'Show up first'}</T>
                  <T v="small" color="muted">
                    Boosted profiles appear at the top of search, marked Featured. {naira(boostPrice)} for 7 days.
                  </T>
                  {d.status !== 'APPROVED' ? <T v="caption">Available once your profile is live.</T> : null}
                  {boost.error ? <Notice tone="danger">{boost.error}</Notice> : null}
                  <Button
                    title={d.boost.active ? 'Add 7 more days' : `Boost for ${naira(boostPrice)}`}
                    kind="secondary"
                    disabled={d.status !== 'APPROVED'}
                    loading={boost.pending}
                    onPress={() =>
                      Alert.alert(`Boost for ${naira(boostPrice)}?`, '7 days at the top of search (test mode).', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Boost', onPress: () => boost.submit({}) },
                      ])
                    }
                  />
                </Card>
              </Section>

              <Section title="Receipts">
                {d.receipts.length === 0 ? (
                  <Empty icon="receipt-outline" title="No receipts yet" />
                ) : (
                  <Card style={{ paddingVertical: space.xs }}>
                    {(showAll ? d.receipts : d.receipts.slice(0, 8)).map((r, i) => (
                      <View key={r.id}>
                        {i > 0 ? <Divider /> : null}
                        <Row title={r.description} subtitle={`${r.ref} · ${date(r.createdAt)}`} right={<T v="bodyStrong">{naira(r.amount)}</T>} chevron={false} />
                      </View>
                    ))}
                  </Card>
                )}
                {d.receipts.length > 8 && !showAll ? <Button title="Show all" kind="ghost" small onPress={() => setShowAll(true)} /> : null}
              </Section>
            </Gap>
          );
        }}
      </QueryView>
    </Screen>
  );
}
