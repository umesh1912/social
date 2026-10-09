# Duo (Expo / React Native)

An implementation of the **Duo App v3** design from `../project/Duo App v3.dc.html`: one identity with two spaces, Personal (pink) and Work (indigo).

## Run it

```bash
npm install
npx expo start          # press i (iOS), a (Android) or w (web)
```

Everything runs in **Expo Go**. `react-native-maps` uses Apple Maps on iOS and Google Maps on Android. A production Android build needs a Google Maps API key (see the react-native-maps / Expo docs).

Other checks:

```bash
npm run typecheck       # tsc --noEmit
npx expo lint
```

## Build an Android APK

Cloud build with EAS (free Expo account; no Android SDK needed):

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview   # "preview" in eas.json outputs an .apk
```

When it finishes, EAS prints a download link and a QR code for the APK.

Local build instead (needs Android Studio / the Android SDK and JDK 17+):

```bash
npx expo prebuild -p android
cd android && ./gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

## What's in it

All 14 screens from the prototype, with the same interactions:

| Area | Where |
| --- | --- |
| Onboarding (welcome → Personal → Work) | `src/app/onboarding.tsx` |
| Home feed, stories row, endorsement card, posts (like / double-tap / save / send) | `src/app/(tabs)/index.tsx` |
| Chats + Calls, active-now row, unread badges | `src/app/(tabs)/chats.tsx` |
| Nearby map: people & meetups, say hi, message, join, start a meetup, visible/hidden | `src/app/(tabs)/nearby.tsx`, `src/components/map/` |
| Groups (Personal) | `src/app/(tabs)/groups.tsx` |
| Opportunities deck (skip / apply / save) + mentors (Work) | `src/app/(tabs)/jobs.tsx` |
| Profile flip card (friends ↔ colleagues), skills, portfolio, experience | `src/app/(tabs)/profile.tsx` |
| Chat thread / group (Chat + Posts), auto-replies, typing | `src/app/thread/[id].tsx` |
| Story viewer, Call, Compose (audience picker), Activity, Discover | `src/app/*.tsx` |

Shared pieces:

- `src/store.tsx`: all app state and actions, ported from the prototype's component logic. It includes the mode switch, which remaps the Groups/Jobs tab and closes overlays.
- `src/data.ts`: the seed content (people, chats, posts, jobs, nearby pins).
- `src/theme.ts`: Personal/Work themes, gradients, slate palette, Plus Jakarta Sans weights.
- `src/components/chrome.tsx`: header, floating tab bar with the mode orb, colour-wipe transition, toast, jump-to-screen panel.
- `src/components/ui.tsx`: Txt, Icon (shadcn icon names → Lucide), Gradient, Img, Avatar, and the shadcn Button/Switch.

## Notes and deviations from the prototype

- **Jump to screen:** on wide web (≥760px) the app opens on the prototype's presentation page, with the intro, the jump panel and an iPhone frame. On a phone, **long-press the screen title** to open the same jump list as a sheet.
- **Launch options:** the prototype's `startMode` / `skipOnboarding` props are `START_MODE` / `SKIP_ONBOARDING` in `src/store.tsx`.
- **Map look:** web uses Leaflet + OpenStreetMap with the prototype's desaturated tiles. iOS uses Apple's `mutedStandard` map type. Android uses a desaturated Google style.
- **"Two circles." gradient text:** native renders it through a masked gradient. Web falls back to solid pink.
- **Tab bar blur:** iOS gets a real blur. Android and web use the 94% white fill from the design.
- **Portraits** load from randomuser.me, as in the prototype, so they need a network connection. Scene photos ship in `assets/photos/`.
