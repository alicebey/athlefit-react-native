# Athlefit Project Guide

This file is the source of truth for coding-agent project context. Keep it concise and update it when architecture, Firebase data shapes, or development commands change.

## Project Snapshot

- Athlefit is a legacy bare React Native mobile app for discovering and booking sports venues.
- App/package identity: JavaScript app name `athlete`; Android application ID `com.athlete`.
- Core versions: React Native 0.71.1, React 18.2, mixed JavaScript/TypeScript.
- There is no custom backend, REST API, GraphQL API, or server code in this folder.
- The mobile client talks directly to Firebase Authentication and Cloud Firestore.
- `@react-native-firebase/storage` is installed but currently unused.
- Local persisted session state uses Zustand + encrypted MMKV.
- Navigation uses React Navigation stack plus a three-tab main area.

## Development Commands

Use Node 16 for this legacy dependency set. `.nvmrc` pins the installed development version and `.node-version` retains compatibility with other version managers.

```bash
nvm use
npm ci
npm start
npm run android
```

- `npm start`: Metro only.
- `npm run android`: build, install, and open the Android app.
- `npm run ios`: run iOS; CocoaPods and a valid Firebase iOS configuration are prerequisites.
- `npm test`: Jest preset; coverage is currently only the generated smoke test.
- `npm run lint`: ESLint.
- `npm run apk_release`: creates an unsigned release APK; configure a private production keystore outside Git before publishing.

Android config currently expects SDK/compile/target 33, Build Tools 33.0.0, NDK 23.1.7779620, Gradle 7.5.1, Android Gradle Plugin 7.3.1, and Java 17 works in the current development environment.

## Architecture Map

- `index.js` registers the app; `App.js` requests location and renders navigation.
- `src/Router/index.js` owns all stack and bottom-tab routes.
- `src/Screen/` contains feature screens; each screen keeps styles in a sibling `styles.js`.
- `src/Component/` contains shared UI primitives such as `Button`, `Input`, `FieldCard`, and `LoadingOverlay`.
- `src/Service/sessionStore.js` is the persisted Zustand session store.
- `src/Storage/MMKVStoragePersistHelper.js` adapts MMKV for Zustand persistence.
- `src/Utils/` contains fonts, responsive sizing, distance, currency, regex, and loading helpers.
- A local-only `android/app/google-services.json` configures Firebase on Android and is intentionally ignored by Git.
- A local-only `android/app/src/main/assets/appcenter-config.json` exists but App Center is not an installed dependency; it is ignored by Git.
- No `GoogleService-Info.plist` is present, so Firebase is not currently configured for iOS.

## Navigation and Main Flow

Stack routes:

`Splash -> Landing -> Login/Signup -> Starter -> Main`

Additional stack screens: `DetailMenu`, `DetailField`, `OrderField`, `Profile`, `Change Password`, `Detail Order`, and `SearchField`.

`Main` contains three tabs:

- `Home`: sport categories, recommendations, venue search, and profile entry.
- `Order`: current/future bookings for the logged-in user.
- `Nearby`: venue markers on Google Maps.

The splash decision is based on persisted Zustand values, not a fresh Firebase auth-state check:

- `isLogin=false` -> `Landing`
- logged in with no category -> `Starter`
- logged in with a category -> `Main`

## Firebase Usage and Data Shapes

Firebase is the app's backend-as-a-service. Calls are made directly inside screens rather than through a repository/service layer.

### Authentication

- Email/password signup and login.
- Phone-number login is implemented by querying Firestore `users.phone` to find the corresponding email, then using email/password auth.
- Profile display name and password updates use Firebase Auth.
- Logout signs out from Firebase Auth and clears the persisted local session.
- The "Forget Password" button has no behavior yet.

### Firestore `users`

Documents use numeric string IDs such as `"1"`, not Firebase Auth UIDs.

```text
email: string
phone: string
username: string
category: string
id: number
```

Signup chooses the next ID with `collection.get().size + 1`; profile/category updates address the document by the persisted numeric `user_id`.

### Firestore `location`

Fields consumed by the app:

```text
category: lowercase string
location_name: string
location_address: string
location_map: { latitude: number, longitude: number }
image_url?: string
rating: number
open_day: string[]
open_time: string
close_time: string
phone: string
```

Locations are fetched client-side, sorted by Haversine distance, then filtered/searched. Maps open through platform deep links.

### Firestore `order`

Documents also use numeric string IDs generated from collection size.

```text
id: number
duration: number
order_time: Firestore Timestamp
location_name: string
location_address: string
location_map: { latitude: number, longitude: number }
image_url?: string
total_price: number
user_id: number
```

Creating an order writes Firestore directly and opens a prefilled WhatsApp deep link to the venue. The client currently calculates price as `duration * 60000`.

## State and UI Conventions

- Session state: `isLogin`, `username`, `category`, `phone`, `email`, `user_id`, and `location`.
- Reuse existing components and utilities before adding new abstractions or dependencies.
- Preserve the current screen-plus-`styles.js` layout unless a requested refactor requires otherwise.
- Use `LoadingHelper` and `AlertModal` consistently with existing async forms.
- Poppins is the main UI font through `src/Utils/Fonts.tsx` and bundled Android font assets.
- Do not perform a React Native/Firebase dependency migration as an incidental change; treat it as a separate task with platform verification.

## Important Constraints and Known Risks

- Firebase Security Rules and indexes are not in this folder. Direct client access is safe only if deployed rules enforce ownership and allowed fields; verify rules in Firebase before production work.
- Phone login may require unauthenticated reads of user records. Do not broaden Firestore reads without reviewing privacy and rules.
- Numeric IDs based on collection size can collide under concurrent writes. Prefer Auth UID/Firestore auto IDs in a deliberate data migration, not a small unrelated fix.
- Booking price and order payload are client-controlled; there is no trusted server-side validation.
- The MMKV encryption key is hardcoded in source and must not be treated as secret storage.
- The Android Google Maps key is read from ignored `android/local.properties` or `MAPS_API_KEY`; restrict it by Android package/signing certificate and rotate older exposed keys if needed.
- Android release output is unsigned until a private production signing configuration is supplied. Never commit production signing material.
- `npm test` currently stops on the PNG asset imported by `@react-navigation/elements`; repair Jest asset mapping before treating the generated smoke test as a passing baseline.
- `npm run lint` has a large legacy baseline. Do not apply a mass auto-fix during feature work; separate formatting cleanup from behavior changes.
- Location acquisition retries recursively without a retry limit in `App.js` and `Nearby`; permission denial can cause repeated attempts.
- Several list computations sort state arrays in place; be careful when changing recommendation/search behavior.

## Agent Working Rules

- Read this file first, then inspect only files relevant to the requested change.
- Do not assume a separate backend exists; Firebase is the current data/auth boundary.
- Do not print, replace, or commit new credentials. Treat Firebase client configs as configuration that still requires API restrictions and Security Rules.
- Preserve existing behavior unless the user explicitly requests a migration or product change.
- After JavaScript/TypeScript changes, run the smallest relevant check; use lint/test and a platform build when the risk warrants it.
- Update this guide when changing commands, routes, state shape, Firebase collections, or backend architecture.
