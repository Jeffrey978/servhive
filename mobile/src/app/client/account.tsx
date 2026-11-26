import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { NotificationsRow } from '@/components/notifications-row';
import { MenuLink } from '@/components/shared';
import { Avatar, Button, Card, Divider, Gap, Screen, T } from '@/components/ui';
import { useSession } from '@/lib/session';
import { space } from '@/theme';
import { useSignOut } from '@/components/push-provider';
import { useInfoSheet } from '@/components/info-sheet';

/** Client account: saved artisans, reports, help and sign-out. */
export default function ClientAccount() {
  const signOut = useSignOut();
  const info = useInfoSheet();
  const me = useSession().me?.user;

  return (
    <Screen edges={['top']}>
      <T v="title">Account</T>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Avatar uri={me?.avatarUrl} name={me?.name ?? ''} size={56} />
        <View style={{ flex: 1, gap: 2 }}>
          <T v="h3">{me?.name}</T>
          {me?.email ? <T v="small" color="muted">{me.email}</T> : null}
          {me?.area ? <T v="caption">{me.area}</T> : null}
        </View>
      </Card>

      <Card style={{ paddingVertical: space.xs }}>
        <NotificationsRow />
        <Divider />
        <MenuLink icon="heart-outline" title="Saved artisans" onPress={() => router.push('/saved')} />
        <Divider />
        <MenuLink icon="flag-outline" title="Your reports" subtitle="Complaints you've filed and their outcome" onPress={() => router.push('/reports')} />
      </Card>

      <Card style={{ paddingVertical: space.xs }}>
        <MenuLink icon="shield-checkmark-outline" title="How escrow protects you" onPress={() => info.open('guide:client')} />
        <Divider />
        <MenuLink icon="document-text-outline" title="Payment Protection Terms" onPress={() => info.open('legal:protection')} />
        <Divider />
        <MenuLink icon="lock-closed-outline" title="Privacy Policy" onPress={() => info.open('legal:privacy')} />
      </Card>

      <Gap>
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
      </Gap>
    </Screen>
  );
}
