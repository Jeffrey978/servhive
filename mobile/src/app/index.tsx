import { Redirect } from 'expo-router';

import { homeFor, useSession } from '@/lib/session';

/** The app's front door: sends each person to their home (welcome, set-up, client or artisan). */
export default function Index() {
  const session = useSession();
  if (session.status === 'loading') return null;
  return <Redirect href={homeFor(session)} />;
}
