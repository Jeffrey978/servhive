import { Redirect } from 'expo-router';

/** Google sign-in comes back to servhive://sso-callback. The session is already set, so hand over to index. */
export default function SsoCallback() {
  return <Redirect href="/" />;
}
