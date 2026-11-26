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

## Push notifications

The website sends a push (through Expo's push service) for: a new message, a new quote request, a quote received or declined, a job funded, a job marked done, payment released (by the client or automatically), a dispute or complaint, the 24h/3h auto-release reminders, and membership reminders. Tapping one opens the right screen. Pushes are best-effort, like the emails: they never block a booking or payment.

Messages use the same pushes to arrive instantly: when a message push comes in for the conversation you have open, the app refreshes it straight away instead of showing a banner. There is no constant polling. Only when push can't work on that phone (Expo Go, or notifications refused) does an open conversation fall back to refreshing every 10 seconds.

Expo Go can't receive pushes, so push needs a real build of the app. One-time set-up:

1. **Expo account** (free) at expo.dev, then in this folder: `npx eas-cli@latest login` and `npx eas-cli@latest init`. This writes the project id into `app.json`, which the app needs to get a push token.
2. **Android:** create a Firebase project (free), add an Android app with package `com.servhive.app`, and upload its FCM V1 service-account key to Expo (`npx eas-cli@latest credentials`, Android → Push Notifications). Expo's guide: https://docs.expo.dev/push-notifications/fcm-credentials/
3. **iPhone:** needs a paid Apple Developer account ($99/yr). The first `eas build` for iOS offers to create the push key for you; answer yes.
4. **Build and install:** `npx eas-cli@latest build --profile preview --platform android` gives an APK link you can install directly on Android phones. For iPhone use `--profile development` (registered test devices) or TestFlight via `--profile production`.
5. **Website:** apply the `20261126000000_push_tokens` database migration before (or as) this code goes live. Optional: if you switch on "enhanced push security" in the Expo dashboard, add `EXPO_ACCESS_TOKEN` to Vercel.

The app's Account / More screen shows whether notifications are on for that phone, and why not if they're off.

## Building for the stores

Use EAS (`npx eas-cli@latest build`), with no Xcode or Android Studio needed. Profiles are in `eas.json` (development, preview, production). You'll need an Expo account, an Apple Developer account ($99/yr) for iOS, and a Google Play developer account ($25 once) for Android.

## Known limits

- Payments are in test mode, as on the website: membership, boosts and escrow funding are recorded but no money moves.
- Push needs a real build (not Expo Go) and the one-time set-up above.
