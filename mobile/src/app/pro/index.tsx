import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, Divider, Gap, Notice, QueryView, Row, Screen, Section, Stat, StatusBadge, T } from '@/components/ui';
import { useApi, useMeta } from '@/lib/api';
import { date, firstName, greeting, naira } from '@/lib/format';
import { useSession } from '@/lib/session';
import type { ProOverview } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space, useColors } from '@/theme';

/** Where each checklist item is fixed in the app (the website's links point at /pro pages). */
const FIX: Record<string, string> = { id: '/manage/verification', licence: '/manage/verification', photos: '/manage/photos', payout: '/manage/payout' };

/** Artisan home (website: /pro): listing status, what's left to go live, money and recent activity. */
export default function ProHome() {
  const session = useSession();
  const q = useApi<ProOverview>(['pro', 'overview'], '/pro/overview');
  return (
    <Screen edges={['top']} onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <Gap size={2}>
        <T v="caption">{greeting()}</T>
        <T v="title">{firstName(session.me?.user.name ?? '')}</T>
      </Gap>
      <QueryView query={q}>{(d) => <Overview d={d} />}</QueryView>
    </Screen>
  );
}

function Overview({ d }: { d: ProOverview }) {
  const c = useColors();
  const meta = useMeta();
  const submit = useSubmit('pro.submitForReview');
  const live = d.status === 'APPROVED';

  return (
    <Gap size={space.lg}>
      <StatusCard d={d} />

      {!live && d.status !== 'SUSPENDED' && d.status !== 'UNDER_REVIEW' ? (
        <Section title="Get verified">
          <Card style={{ paddingVertical: space.xs }}>
            {d.readiness.items.map((it, i) => (
              <View key={it.key}>
                {i > 0 ? <Divider /> : null}
                <Row
                  left={<Ionicons name={it.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={it.done ? c.success : c.faint} />}
                  title={it.label}
                  subtitle={it.meta ?? (it.required ? null : 'Optional before review, needed to get paid')}
                  onPress={FIX[it.key] ? () => router.push(FIX[it.key] as '/manage/verification') : undefined}
                />
              </View>
            ))}
          </Card>
          {submit.error ? <Notice tone="danger">{submit.error}</Notice> : null}
          <Button title="Submit for review" disabled={!d.readiness.canSubmit} loading={submit.pending} onPress={() => submit.submit({})} />
          {!d.readiness.canSubmit ? <T v="caption">Finish the required items to submit. We usually review within 1–2 working days.</T> : null}
        </Section>
      ) : null}

      <View style={{ flexDirection: 'row', gap: space.md }}>
        <Stat label="Earned" value={naira(d.stats.earned)} hint={`${d.stats.paidJobs} paid ${d.stats.paidJobs === 1 ? 'job' : 'jobs'}`} />
        <Stat label="In escrow" value={naira(d.stats.held)} hint={`${d.stats.heldJobs} active`} />
      </View>
      <Card onPress={() => router.push('/pro/requests')} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Ionicons name="file-tray-full-outline" size={24} color={c.accent} />
        <View style={{ flex: 1 }}>
          <T v="bodyStrong">
            {d.stats.openRequests} new {d.stats.openRequests === 1 ? 'request' : 'requests'}
          </T>
          <T v="caption">Reply quickly. Clients see your response time.</T>
        </View>
        <Ionicons name="chevron-forward" size={18} color={c.faint} />
      </Card>

      <MembershipCard d={d} monthly={meta.data?.rules.monthlySubscription} />

      {d.jobs.length ? (
        <Section title="Recent jobs" action={<T v="small" color="accent" onPress={() => router.push('/pro/jobs')}>All jobs</T>}>
          <Card style={{ paddingVertical: space.xs }}>
            {d.jobs.map((j, i) => (
              <View key={j.id}>
                {i > 0 ? <Divider /> : null}
                <Row
                  title={j.serviceName}
                  subtitle={`${j.client.name} · ${naira(j.payoutAmount)}`}
                  right={<StatusBadge status={j.status} />}
                  onPress={() => router.push({ pathname: '/manage/job/[id]', params: { id: j.id } })}
                />
              </View>
            ))}
          </Card>
        </Section>
      ) : null}
    </Gap>
  );
}

function StatusCard({ d }: { d: ProOverview }) {
  switch (d.status) {
    case 'APPROVED':
      return (
        <Notice tone="success" title="Your profile is live" icon="shield-checkmark">
          {d.boost.active ? `Boosted for ${d.boost.daysLeft} more ${d.boost.daysLeft === 1 ? 'day' : 'days'}.` : 'Clients can find and hire you.'}
        </Notice>
      );
    case 'UNDER_REVIEW':
      return (
        <Notice tone="info" title="Under review">
          We're checking your documents. We usually review within 1–2 working days.
        </Notice>
      );
    case 'REJECTED':
      return (
        <Notice tone="danger" title="Changes needed">
          {d.rejectionReason ? `${d.rejectionReason} Fix this, then submit again.` : 'Fix the items below, then submit again.'}
        </Notice>
      );
    case 'SUSPENDED':
      return (
        <Notice tone="danger" title="Profile suspended">
          {d.rejectionReason ?? 'Your profile is hidden from clients. Contact Servhive support.'}
        </Notice>
      );
    default:
      return (
        <Notice tone="accent" title="Finish your profile to go live">
          Upload your ID and work photos, then submit for review.
        </Notice>
      );
  }
}

function MembershipCard({ d, monthly }: { d: ProOverview; monthly?: number }) {
  const b = d.billing;
  const line =
    b.state === 'trial'
      ? `Free month: ${b.trialDaysLeft} ${b.trialDaysLeft === 1 ? 'day' : 'days'} left`
      : b.state === 'paid'
        ? `Membership paid until ${date(b.paidUntil)}`
        : 'Membership due: your profile is hidden until you pay';
  return (
    <Card onPress={() => router.push('/manage/billing')} style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T v="label">Membership</T>
        {b.state === 'due' ? <StatusBadge status="OPEN" /> : null}
      </View>
      <T v="bodyStrong">{line}</T>
      <T v="caption">You keep 100% of every job{monthly ? ` · ${naira(monthly)} a month after the trial` : ''}</T>
    </Card>
  );
}
