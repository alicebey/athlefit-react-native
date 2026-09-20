<p align="center">
  <img src="src/Assets/ALTHEFIT.png" alt="Athlefit" width="360" />
</p>

# Athlefit

Athlefit is a React Native app for discovering nearby sports venues and creating bookings. This legacy project is being modernized as a portfolio case study with a Spring Boot API, PostgreSQL, and Firebase Authentication.

## Highlights

- Email/password registration and login with Firebase Authentication
- Spring Boot REST API with verified Firebase ID tokens
- PostgreSQL persistence and versioned Flyway migrations
- Server-side price, operating-hour, and booking-conflict validation
- Geoapify-assisted venue onboarding with confirmed PostgreSQL schedule snapshots
- In-app admin venue search, review, pricing, capacity, and publishing
- Multi-sport pricing with automatic court assignment
- Confirmed-booking details and cancellation with explicit confirmation
- Sports preference onboarding, search, nearby recommendations, and maps
- Persisted mobile session with Zustand and MMKV

## Architecture

```text
React Native app
  |-- Firebase Authentication (identity only)
  |-- Spring Boot REST API (profiles, venues, bookings)
          |-- PostgreSQL
          |-- Firebase ID-token verification
          |-- Geoapify venue import during admin onboarding
```

Cloud Firestore is no longer used by the app. The Spring Boot project lives locally at:

```text
/Users/eki/React Native/Backend/Althefit-macro
```

See [AGENTS.md](AGENTS.md) for the detailed architecture and API contract.

## Tech Stack

- React Native 0.71.1 and React 18.2
- React Navigation 6
- Firebase Authentication 16.7
- Zustand, Immer, and react-native-mmkv
- React Native Maps and community Geolocation
- Spring Boot 4.1, Java 17, PostgreSQL 17, and Flyway

## Run Locally

### Prerequisites

- Node.js 16.20.2 through NVM
- Java 17
- Docker Desktop
- Android Studio and an Android emulator
- Android SDK 33, Build Tools 33.0.0, and NDK 23.1.7779620

### 1. Start PostgreSQL and the backend

```bash
cd "/Users/eki/React Native/Backend/Althefit-macro"
docker compose up -d
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`. Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

### 2. Configure the mobile app

Place the Firebase Android client configuration at:

```text
android/app/google-services.json
```

Copy `android/local.properties.example` to `android/local.properties`, then set the Android SDK path and Maps key:

```properties
sdk.dir=/path/to/Android/sdk
MAPS_API_KEY=your_android_maps_api_key
```

These local configuration files are excluded from Git.

### 3. Run Android

```bash
cd "/Users/eki/React Native/athlefit-main"
nvm use
npm ci
npm run android
```

The Android emulator accesses the host backend through `http://10.0.2.2:8080`. iOS uses `http://localhost:8080`. A physical device or deployed build needs a reachable HTTPS API URL in `src/Config/api.js`.

## Checks

Mobile:

```bash
npm test -- --runInBand
npm run lint
```

Backend:

```bash
cd "/Users/eki/React Native/Backend/Althefit-macro"
./mvnw test
```

## Important Notes

- Existing Firestore documents are not automatically imported. PostgreSQL currently starts with seven demo venues from Flyway seed data.
- Login by phone number was removed. The old implementation exposed a phone-to-email lookup; login is now email/password only.
- A venue can offer multiple sports, each with its own hourly price and court count. The backend assigns court numbers automatically.
- The API computes booking prices and PostgreSQL prevents overlapping confirmed bookings on the same court.
- Geoapify venue onboarding and required backend environment variables are documented in the backend `docs/VENUE_ONBOARDING.md`.
- Admin UIDs see **Manage Venues** on the Profile screen; regular users never see the onboarding UI.
- The current base URL and Android cleartext permission are for local debug use only. Production should use HTTPS and environment-specific configuration.

## Roadmap

- [x] Add no-card Geoapify venue discovery, schedule confirmation, and Swagger onboarding
- [x] Add an admin venue onboarding screen
- [ ] Add venue editing/deactivation and a richer owner dashboard
- [x] Add booking cancellation to the mobile UI
- [x] Improve loading, empty, offline, and permission-denied states
- [ ] Add integration tests using PostgreSQL/Testcontainers
- [ ] Configure Firebase and backend connectivity for iOS
- [ ] Move API URLs to build-time development/staging/production configuration
- [ ] Upgrade React Native in a dedicated migration
- [ ] Add polished screenshots, architecture visuals, and a demo video

## Documentation

- [AGENTS.md](AGENTS.md): shared coding-agent context and mobile/backend contract
- [CLAUDE.md](CLAUDE.md): Claude Code entry point importing the shared guide
- Backend `README.md`: API setup, endpoints, schema, and security notes
