# Athlefit Project Guide

Read this file first. It is the concise source of truth for coding agents working on the Athlefit mobile app.

## Project Snapshot

- Bare React Native 0.71.1 app; React 18.2; mostly JavaScript.
- JavaScript app name: `athlete`; Android application ID: `com.athlete`.
- Mobile root: `/Users/eki/React Native/athlefit-main`.
- Backend root: `/Users/eki/React Native/Backend/Althefit-macro`.
- Firebase Authentication handles identity only. Firestore and Firebase Storage are not used.
- Spring Boot owns profiles, venues, booking rules, and PostgreSQL access.
- Geoapify supplies venue candidates during admin onboarding; confirmed details and hours are stored in PostgreSQL.
- Zustand + MMKV persist mobile session data.

## Development Commands

Use Node 16.20.2 (`.nvmrc` and `.node-version`).

```bash
# Database and API
cd "/Users/eki/React Native/Backend/Althefit-macro"
docker compose up -d
./mvnw spring-boot:run

# Mobile, in another terminal
cd "/Users/eki/React Native/athlefit-main"
nvm use
npm ci
npm start
npm run android
```

Checks:

```bash
npm test -- --runInBand
npm run lint
cd "/Users/eki/React Native/Backend/Althefit-macro" && ./mvnw test
```

Android expects compile/target SDK 33, Build Tools 33.0.0, NDK 23.1.7779620, Gradle 7.5.1, Android Gradle Plugin 7.3.1, and Java 17.

## Runtime Architecture

```text
index.js -> App.js -> src/Router
                         |-- auth/onboarding screens
                         |-- Home / Order / Nearby tabs
                         |-- venue and booking details

Screens -> src/Service/* -> Spring Boot REST API -> PostgreSQL
        -> Firebase Auth -> Firebase ID token -> API verification
        -> Zustand session store -> MMKV
        -> location, maps, and optional WhatsApp deep links
```

Service modules:

- `src/Service/apiClient.js`: fetch wrapper and Firebase Bearer token.
- `src/Service/userService.js`: current profile reads/updates.
- `src/Service/venueService.js`: public venue reads, sports list, slot availability, multi-sport helpers (`offersSport`, `withPrimarySport`).
- `src/Service/bookingService.js`: current user's bookings, creation, manual payment submission, cancellation, status labels.
- `src/Service/ownerService.js`: owner/admin venue management, venue bookings, payment confirm/reject, owner assignment.
- `src/Service/adminVenueService.js`: admin status, Geoapify search, validation, and publishing.
- `src/Service/sessionStore.js`: local UI/session state.
- `src/Config/api.js`: development API base URL.
- `src/Utils/VenueTime.js`: format timestamps in venue time (WIB, +07:00) regardless of device time zone. Never format booking times with `new Date(...)`/device time.
- `src/Utils/Sports.js`: `useSports()` loads sports from the API (fallback list mirrors the seed) and maps slugs to icons.

The services map backend DTOs to the old screen field names. This compatibility layer avoids a large UI rewrite; change it deliberately if backend response fields change.

## Authentication and Session Flow

- Signup creates an email/password Firebase user, updates the Firebase display name, then creates/updates `/api/v1/users/me`.
- Login is email/password only. Phone login was removed because the legacy flow queried user records to discover an email address.
- Every private API request sends `Authorization: Bearer <Firebase ID token>`.
- Splash checks the actual Firebase session and refreshes the profile from the API before routing.
- Profile name and password updates still update Firebase Auth where appropriate; profile data also updates the API.
- Logout signs out of Firebase and clears Zustand/MMKV state.
- Login's “Forgot Password” action opens a dedicated screen and sends a Firebase password-reset email to the validated email entered in the form.

## API Contract Used by Mobile

Base URLs:

- Android emulator: `http://10.0.2.2:8080`
- iOS simulator/local default: `http://localhost:8080`

Endpoints:

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/sports` | Public | List sports |
| GET | `/api/v1/venues?category={slug}` | Public | List/filter venues |
| GET | `/api/v1/venues/{id}` | Public | Venue detail (optional `?sport=`) |
| GET | `/api/v1/venues/{id}/availability?sport=&date=&durationHours=` | Public | Bookable start slots for a WIB date |
| GET | `/api/v1/users/me` | Firebase token | Get or create profile |
| PATCH | `/api/v1/users/me` | Firebase token | Update name, phone, favorite sport |
| GET | `/api/v1/bookings/me` | Firebase token | Current user's bookings |
| POST | `/api/v1/bookings` | Firebase token | Reserve a court (`PENDING_PAYMENT`) |
| POST | `/api/v1/bookings/{id}/payment` | Firebase token | Submit transfer details (`WAITING_CONFIRMATION`) |
| GET | `/api/v1/bookings/{id}` | Firebase token | Owned booking detail |
| PATCH | `/api/v1/bookings/{id}/cancel` | Firebase token | Cancel owned booking |
| GET | `/api/v1/admin/status` | Firebase token | Return `{admin, owner}` roles |
| GET/PATCH | `/api/v1/owner/venues[/{id}]` | Owner or admin | List/read/update managed venues |
| PUT | `/api/v1/owner/venues/{id}/sports/{slug}` | Owner or admin | Upsert sport price and court count |
| GET | `/api/v1/owner/venues/{id}/bookings` | Owner or admin | Venue bookings |
| PATCH | `/api/v1/owner/bookings/{id}/confirm-payment` / `reject-payment` | Owner or admin | Review manual payments |
| PUT | `/api/v1/admin/venues/{id}/owner` | Admin UID | Assign venue owner by email |
| GET | `/api/v1/admin/geoapify-places/search` | Admin UID | Search onboarding candidates |
| POST | `/api/v1/admin/venues` | Admin UID | Publish a reviewed venue configuration |

Create booking body:

```json
{
  "venueId": "uuid",
  "sportSlug": "badminton",
  "startAt": "2026-09-01T10:00:00+07:00",
  "durationHours": 2
}
```

The backend calculates total price, validates stored operating hours, automatically assigns an available court, and rejects the booking when all configured courts are occupied. Never reintroduce client-authoritative pricing or court selection logic in the client.

`OrderField` loads the availability endpoint and sends the selected slot's `startAt` string unchanged (it already carries `+07:00`).

Booking lifecycle shown in the app: `PENDING_PAYMENT` (30-minute window; `DetailOrder` shows the venue's bank account and a payer form) → `WAITING_CONFIRMATION` → `CONFIRMED`; or `EXPIRED` / `CANCELLED`. Unpaid bookings can be cancelled any time before start, paid/submitted ones until 2 hours before start (server returns `cancellable` and `cancellableUntil`; the app only displays them).

## Navigation and Data Conventions

Stack flow: `Splash -> Landing -> Login/Signup -> Starter -> Main`.

Additional screens: `DetailMenu`, `DetailField`, `OrderField` (sport/date/duration/slot picker), `Profile`, `Change Password`, `Forgot Password`, `Detail Order` (status, payment, cancellation), `SearchField`, owner/admin `Owner Venues` → `Owner Venue` (Bookings tab: review payments; Settings tab: visibility, hours, transfer account, sports/courts, admin-only owner assignment), and admin-only `Admin Venues` (Geoapify onboarding).

`Main` tabs:

- `Home`: categories, recommendations, and venue search.
- `Order`: Upcoming (active, not finished) and History tabs.
- `Nearby`: venue markers on Google Maps.
- `Profile`: account details, sport preference, password, logout, "My venues" (owners/admins) and "Add a venue" (admins).

Legacy venue keys expected by screens are `location_name`, `location_address`, `location_map`, `open_day`, `open_time`, `close_time`, `image_url`, `phone`, `rating`, `category`, `hourly_rate`, and `court_count`. `venueService.js` owns this mapping, expands relative backend image URLs, and maps Geoapify/OpenStreetMap attribution fields for the detail screen.

`GET /venues` returns each venue once with `sports[]` (mapped to `sports: [{slug, name, hourly_rate, court_count}]`); use `item.id` as a key safely.

Bookings keep `order_time.seconds`/`end_time.seconds` for sorting, plus `start_at`/`end_at` (WIB strings) for display and payment/cancellation fields (`payment_deadline`, `payment_account`, `payer_*`, `cancellable`, `cancellable_until`, `refund_required`, `customer`).

## Local Configuration and Secrets

- `android/app/google-services.json` is required locally and ignored by Git.
- `android/local.properties` contains `sdk.dir` and `MAPS_API_KEY`; it is ignored by Git.
- No `GoogleService-Info.plist` is present, so Firebase is not configured for iOS yet.
- Never commit Firebase service accounts, signing keys, `.env`, Maps keys, or production credentials.
- Firebase client configuration is not a server secret, but its APIs/keys still need proper restrictions.

## Current Limits

- PostgreSQL keeps seven manual demo venues (demo transfer account `BCA (demo) 0000000000`); legacy Firestore data has not been imported.
- Payments are manual bank transfers verified by the owner; there is no payment gateway, receipt upload, or "refund sent" tracking yet.
- Admin venue onboarding supports Geoapify search, multiple sports, price/court configuration, schedule review, and publishing from the Profile screen. Swagger remains a debugging fallback.
- Users do not choose a court number; the backend assigns one from the configured venue/sport court inventory.
- Local Android debug allows HTTP. Production must use HTTPS and environment-specific URLs.
- `npm run lint` still reports a legacy warning/error baseline outside the migrated files; avoid unrelated mass formatting.
- React Native and several native dependencies are old and should be upgraded separately.

## Agent Working Rules

- Inspect only relevant files after reading this guide and the backend `AGENTS.md` when changing API behavior.
- Reuse existing components and the four service modules before adding dependencies or abstractions.
- Keep Firebase Auth; do not add direct Firestore access back into screens.
- Preserve server authority for booking price, ownership, schedule, and conflict checks.
- Keep credentials out of code and Git.
- Run focused lint/tests, then an Android build when changes affect native integration or end-to-end flow.
- Update this file and the backend guide whenever commands, endpoints, auth, or data shapes change.
