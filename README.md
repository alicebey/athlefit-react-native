<p align="center">
  <img src="src/Assets/ALTHEFIT.png" alt="Athlefit" width="360" />
</p>

# Athlefit

Athlefit is a React Native mobile app for discovering nearby sports venues and creating bookings. It combines Firebase authentication and data storage with location-aware recommendations, maps, and a lightweight booking flow.

> This is a legacy project being revived and modernized as a portfolio case study. The Android app runs today; security, data integrity, testing, and platform upgrades are tracked in the roadmap below.

## Highlights

- Email/password registration and login with Firebase Authentication
- Sports preference onboarding
- Nearby venue recommendations using Haversine distance
- Search and category filtering
- Venue details, opening hours, ratings, and map directions
- Booking creation with date, time, duration, and WhatsApp handoff
- Persisted user session with Zustand and MMKV
- Android and iOS native projects from a bare React Native setup

## Tech Stack

- React Native 0.71.1 and React 18.2
- React Navigation 6
- Firebase Authentication and Cloud Firestore
- Zustand, Immer, and react-native-mmkv
- React Native Maps and community Geolocation
- JavaScript with selected TypeScript utilities

## Architecture

```text
index.js -> App.js -> React Navigation
                       |-- authentication/onboarding screens
                       |-- Home / Order / Nearby tabs
                       |-- detail and booking screens

Screens -> Firebase Auth / Firestore
        -> Zustand session store -> MMKV persistence
        -> native location, maps, and WhatsApp deep links
```

There is no custom REST or GraphQL backend in this repository. Firebase is used directly as the backend-as-a-service.

## Firestore Collections

| Collection | Purpose |
| --- | --- |
| `users` | Profile, phone number, sport preference, and legacy numeric user ID |
| `location` | Venue details, coordinates, schedule, rating, contact, and image URL |
| `order` | Booking time, duration, venue snapshot, price, and user reference |

See [AGENTS.md](AGENTS.md) for the detailed routes, state shape, and document fields.

## Getting Started

### Prerequisites

- Node.js 16.20.2 through NVM
- npm
- Java 17
- Android Studio and an Android emulator
- Android SDK 33, Build Tools 33.0.0, and NDK 23.1.7779620
- A Firebase Android app and a restricted Google Maps API key

### Local configuration

1. Download your Firebase Android configuration and save it as:

   ```text
   android/app/google-services.json
   ```

2. Copy `android/local.properties.example` to `android/local.properties` and set your Android SDK path and Maps key:

   ```properties
   sdk.dir=/path/to/Android/sdk
   MAPS_API_KEY=your_android_maps_api_key
   ```

These local service files are intentionally excluded from Git.

### Install and run

```bash
nvm use
npm ci
npm run android
```

For Metro only:

```bash
npm start
```

Other available checks:

```bash
npm test
npm run lint
```

## Project Structure

```text
src/
  Assets/       Images and bundled artwork
  Component/    Shared UI components
  Router/       Stack and bottom-tab navigation
  Screen/       Product screens and their styles
  Service/      Persisted Zustand session store
  Storage/      MMKV persistence adapter
  Utils/        Fonts, sizing, distance, currency, and validation helpers
android/        Native Android project
ios/            Native iOS project
```

## Security Notes

- Firebase client configuration, App Center configuration, Maps keys, and signing material are not committed.
- A public deployment must use restrictive Firestore Security Rules and API-key restrictions.
- The legacy numeric ID strategy and client-controlled booking price require migration before production use.
- No production signing key belongs in this repository.

## Current Quality Baseline

- Android manifest processing and local Maps-key configuration pass successfully.
- The generated Jest smoke test currently stops on React Navigation's PNG asset because Jest does not yet map that asset type.
- ESLint reports legacy formatting, hook dependency, unused import, and inline-style debt.

These known issues are documented rather than hidden or mixed into the initial portfolio import.

## Roadmap

- [ ] Add and test Firestore Security Rules
- [ ] Use Firebase Auth UID and Firestore auto IDs
- [ ] Validate booking availability and pricing atomically
- [ ] Improve auth, permission, offline, and error states
- [ ] Repair Jest asset mapping and establish a passing smoke-test baseline
- [ ] Reduce ESLint debt while keeping formatting changes separate from behavior changes
- [ ] Add focused tests for core booking and location logic
- [ ] Configure Firebase for iOS
- [ ] Upgrade React Native in a dedicated migration branch
- [ ] Add polished screenshots and a short demo video

## Documentation

- [AGENTS.md](AGENTS.md): shared project context and coding-agent guidance
- [CLAUDE.md](CLAUDE.md): Claude Code entry point importing the shared guide
