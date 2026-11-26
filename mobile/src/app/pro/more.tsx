import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { MenuLink } from '@/components/shared';
import { Avatar, Button, Card, Divider, Screen, StatusBadge, T } from '@/components/ui';
import { openLegal, openSite } from '@/lib/links';
import { useSession } from '@/lib/session';
import { space } from '@/theme';

/** Everything else for artisans: profile, photos, verification, payout, membership, complaints. */
export default function ProMore() {
  const { signOut } = useAuth();
  const me = useSession().me;
  const p = me?.provider;
  return (
    <Screen edges={['top']}>
      <T v="title">More</T>
      {p ? (
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <Avatar uri={p.imageUrl} name={p.businessName} size={56} />
          <View style={{ flex: 1, gap: 4 }}>
            <T v="h3">{p.businessName}</T>
            <T v="small" color="muted">
              {p.category.name}
            </T>
            <StatusBadge status={p.status} />
          </View>
        </Card>
      ) : null}

      <Card style={{ paddingVertical: space.xs }}>
        <MenuLink icon="person-outline" title="Profile & services" subtitle="What clients see" onPress={() => router.push('/manage/profile')} />
        <Divider />
        <MenuLink icon="images-outline" title="Work photos" onPress={() => router.push('/manage/photos')} />
        <Divider />
        <MenuLink icon="shield-checkmark-outline" title="Verification" subtitle="ID, licence and review" onPress={() => router.push('/manage/verification')} />
        {p ? (
          <>
            <Divider />
            <MenuLink icon="eye-outline" title="View public profile" onPress={() => router.push({ pathname: '/artisan/[slug]', params: { slug: p.slug } })} />
          </>
        ) : null}
      </Card>

      <Card style={{ paddingVertical: space.xs }}>
        <MenuLink icon="card-outline" title="Payout account" subtitle="Where your money is sent" onPress={() => router.push('/manage/payout')} />
        <Divider />
        <MenuLink icon="ribbon-outline" title="Membership & boost" onPress={() => router.push('/manage/billing')} />
        <Divider />
        <MenuLink icon="alert-circle-outline" title="Complaints" subtitle="Reports from clients and your responses" onPress={() => router.push('/manage/complaints')} />
      </Card>

      <Card style={{ paddingVertical: space.xs }}>
        <MenuLink icon="help-circle-outline" title="How Servhive works for pros" onPress={() => openSite('/for-pros')} />
        <Divider />
        <MenuLink icon="document-text-outline" title="Provider Agreement" onPress={() => openLegal('provider')} />
        <Divider />
        <MenuLink icon="lock-closed-outline" title="Privacy Policy" onPress={() => openLegal('privacy')} />
      </Card>

      <Button
        title="Sign out"
        kind="secondary"
        icon="log-out-outline"
        onPress={() =>
          Alert.alert('Sign out?', undefined, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
          ])
        }
      />
    </Screen>
  );
}
