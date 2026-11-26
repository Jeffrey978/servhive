import { useAuth } from '@clerk/expo';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, T } from '@/components/ui';
import { openSite } from '@/lib/links';
import { space, useColors } from '@/theme';

/** Admins work on the website; the app is for clients and artisans. */
export default function Admin() {
  const c = useColors();
  const { signOut } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flex: 1, padding: space.xl, justifyContent: 'center', gap: space.lg }}>
        <Card style={{ gap: space.md }}>
          <T v="h2">Admin tools are on the website</T>
          <T color="muted">Approvals, the escrow ledger and disputes are managed in the admin console at servhive.com/admin.</T>
          <Button title="Open the admin console" onPress={() => openSite('/admin')} />
        </Card>
        <Button title="Sign out" kind="ghost" onPress={() => signOut()} />
      </View>
    </SafeAreaView>
  );
}
