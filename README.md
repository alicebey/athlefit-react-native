<p align="center">
  <img src="src/Assets/ALTHEFIT.png" alt="Athlefit" width="360" />
</p>

# Athlefit

Athlefit is a React Native app for discovering nearby sports venues and booking a court. Originally a university thesis project backed by Cloud Firestore, it is being modernized as a portfolio case study: a Spring Boot API owns the business rules, PostgreSQL owns the data, and Firebase provides identity only.

**Backend repository:** [alicebey/athlefit-backend](https://github.com/alicebey/athlefit-backend)

## Highlights

- **Pick a free slot, not a guess.** The booking screen shows hourly start times for the chosen sport, date and duration, with the number of courts still free.
- **Payments with a held court.** A new booking holds its court for 30 minutes while the customer transfers the money; they submit the transfer details and the venue owner confirms or rejects them. Unpaid bookings expire automatically.
- **Cancellation rules people can see.** Unpaid bookings can be cancelled any time before the start; paid ones until 2 hours before. Cancelled-after-paying bookings are flagged for refund.
- **A workspace for venue owners.** Owners review payments and edit opening hours, visibility, transfer account, prices and court counts. Admins assign owners and onboard venues from Geoapify.
- **Nearby that works.** Live location, venues sorted by distance with a map that fits you and the closest venues.
- **Correct times, always.** All booking times are shown in venue time (WIB), whatever the phone's own time zone is.
- Email/password authentication with Firebase; every API call carries a verified ID token
- Server-side price, operating-hour, court-assignment and conflict validation
- PostgreSQL persistence with versioned Flyway migrations
- Persisted session with Zustand and MMKV; Jest tests for services, screens and utilities

## Architecture

```text
React Native app
  screens -> src/Service/*  --fetch + Firebase ID token-->  Spring Boot REST API
                                                              |-- PostgreSQL (users, venues,
                                                              |   sports, courts, bookings)
                                                              |-- Firebase JWT verification
                                                              `-- Geoapify (admin onboarding only)
  |-- Firebase Authentication (identity only)
  |-- Zustand + MMKV session
  `-- Maps, geolocation, phone/WhatsApp deep links
```

Firebase handles identity; everything else — profiles, venues, prices, courts, availability, payments and bookings — is owned by the backend. Cloud Firestore is no longer used.

### Booking lifecycle

```text
Reserve a slot ──> PENDING_PAYMENT ──submit transfer──> WAITING_CONFIRMATION ──owner confirms──> CONFIRMED
                     │ held 30 min                         │ owner rejects
                     └──> EXPIRED (court released)          └──> CANCELLED
        customer cancels: unpaid any time before start, paid until 2 h before ──> CANCELLED (refund flagged)
```

The server is authoritative: it calculates the price, validates the venue's opening hours in Asia/Jakarta, assigns a free court, and a PostgreSQL exclusion constraint makes double booking impossible.

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

Clone the [backend repository](https://github.com/alicebey/athlefit-backend) next to this project, then:

```bash
cd athlefit-backend
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

Backend (in the backend repository):

```bash
./mvnw test
```

## Important Notes

- Existing Firestore documents are not automatically imported. PostgreSQL currently starts with seven demo venues from Flyway seed data.
- Login by phone number was removed. The old implementation exposed a phone-to-email lookup; login is now email/password only.
- A venue can offer multiple sports, each with its own hourly price and court count. The backend assigns court numbers automatically.
- The API computes booking prices and PostgreSQL prevents overlapping confirmed bookings on the same court.
- Geoapify venue onboarding and required backend environment variables are documented in the backend `docs/VENUE_ONBOARDING.md`.
- Roles come from `GET /api/v1/admin/status`. Owners and admins see **My venues** on the Profile screen; admins also see **Add a venue**. Regular users never see either.
- Payments are manual bank transfers verified by the venue owner. There is no payment gateway, receipt upload, or refund tracking yet.
- Booking times are sent and displayed in venue time (`+07:00`); never format them with the device's own time zone.
- The current base URL and Android cleartext permission are for local debug use only. Production should use HTTPS and environment-specific configuration.

## Roadmap

- [x] Add no-card Geoapify venue discovery, schedule confirmation, and Swagger onboarding
- [x] Add an admin venue onboarding screen
- [x] Add venue editing/deactivation and an owner dashboard with payment review
- [x] Add booking cancellation to the mobile UI
- [x] Improve loading, empty, offline, and permission-denied states
- [x] Add slot availability, manual payments and cancellation rules
- [ ] Add integration tests using PostgreSQL/Testcontainers
- [ ] Configure Firebase and backend connectivity for iOS
- [ ] Move API URLs to build-time development/staging/production configuration
- [ ] Upgrade React Native in a dedicated migration
- [ ] Add polished screenshots, architecture visuals, and a demo video

## Documentation

- [AGENTS.md](AGENTS.md): shared coding-agent context and mobile/backend contract
- [CLAUDE.md](CLAUDE.md): Claude Code entry point importing the shared guide
- [Backend repository](https://github.com/alicebey/athlefit-backend): API setup, endpoints, schema, and security notes
