import { Linking } from 'react-native';

import { Badge, Row } from '@/components/ui';
import { usePushState } from '@/lib/push';

const WHY: Record<string, string> = {
  'expo-go': 'Not available in Expo Go. Install the Servhive app build to get notifications.',
  simulator: 'Notifications need a real phone.',
  'no-project': 'This build isn’t set up for notifications yet.',
  denied: 'Turned off. Tap to allow them in Settings.',
  error: 'Couldn’t switch on notifications. Try again later.',
};

/** Shows whether this phone gets push notifications, and opens Settings if they were refused. */
export function NotificationsRow() {
  const s = usePushState();
  if (s.status === 'enabled') {
    return <Row icon="notifications-outline" title="Notifications" subtitle="On: messages, quotes, jobs and payments" right={<Badge label="On" tone="success" />} chevron={false} />;
  }
  if (s.status === 'idle') return <Row icon="notifications-outline" title="Notifications" subtitle="Checking…" chevron={false} />;
  return (
    <Row
      icon="notifications-off-outline"
      title="Notifications"
      subtitle={WHY[s.reason]}
      right={<Badge label="Off" tone="outline" />}
      onPress={s.reason === 'denied' ? () => Linking.openSettings() : undefined}
    />
  );
}
