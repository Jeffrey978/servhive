# Servhive mobile app

The Servhive app for clients and artisans, built with Expo (SDK 58), Expo Router and React Native. It talks to the website through its JSON API (`/api/v1`, in the web app's `src/server/api/` and `src/app/api/v1/`), so every rule (roles, escrow, membership visibility, validation) lives in one place: the website.

Admins use the website; signing in to the app as an admin shows a link to the admin console.

## Run it on your phone

1. Install **Expo Go** from the App Store or Play Store.
2. In this folder, create `.env` from `.env.example` and set `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from Vercel; it starts with `pk_`).
3. `npm install` (first time only), then `npx expo start`.
4. Scan the QR code with your phone's camera (iPhone) or Expo Go (Android). Phone and computer must be on the same Wi-Fi, or use `npx expo start --tunnel`.

The app talks to `https://servhive.com` by default. The `/api/v1` endpoints must be deployed there (merge the API change first), or set `EXPO_PUBLIC_API_URL` to another deployment.

## One-time Clerk set-up (Clerk dashboard)

- **Native applications → enable the Native API.** Without it, sign-in from the app is refused.
- Before a store build, add the iOS bundle ID and Android package (`com.servhive.app`, set in `app.json`) on the same page.

Sign-in uses Clerk's hosted sign-in page in a secure browser sheet (`useHostedAuth`), so the app offers exactly the sign-in methods the website has, and works in Expo Go.

## How it's built

| Where | What |
|---|---|
| `src/app/_layout.tsx` | Providers (Clerk, React Query, toasts), fonts, splash, and the route guards: signed out → `welcome`, not set up → `onboarding`, client → `client/` tabs, artisan → `pro/` tabs, admin → `admin` |
| `src/app/client/`, `src/app/pro/` | The two tab bars (native tabs) |
| `src/app/*` (other) | Screens pushed over the tabs: profiles, threads, forms, the artisan's `manage/` screens |
| `src/lib/api.ts` | Fetch with the Clerk token, React Query hooks, `useAction` for mutations |
| `src/lib/use-submit.ts` | Run a website action from a form: its success text as a toast, its error under the form |
| `src/lib/images.ts` | Pick/take a photo and shrink it to a data URL the website accepts (≤ ~1.9MB each; Vercel caps a request at ~4.5MB) |
| `src/lib/types.ts` | The API's response shapes |
| `src/components/ui.tsx` | The UI kit (text, buttons, fields, selects, cards, badges, states) |
| `src/theme.ts` | Colours (light + dark), Instrument Sans, spacing |

Every mutation goes through `POST /api/v1/actions/<name>`; the names are listed in the web app's `src/server/api/actions.ts` and map to the same server actions the website's forms use.

## Checks

```sh
npx tsc --noEmit      # types
npx expo lint         # lint
npx expo-doctor       # dependency and config health
npx expo export --platform android --platform ios --output-dir /tmp/servhive-export   # proves it bundles
```

## Building for the stores

Use EAS (`npx eas-cli@latest build`), with no Xcode or Android Studio needed. You'll need an Expo account, an Apple Developer account ($99/yr) for iOS, and a Google Play developer account ($25 once) for Android.

## Known limits

- Payments are in test mode, as on the website: membership, boosts and escrow funding are recorded but no money moves.
- No push notifications yet (the website emails artisans when a job is funded; in-app push would need a development build).
- Messages refresh every 8 seconds while a thread is open; there is no live socket.
