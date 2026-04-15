# Setup Guide

## Node and admin/backend setup
1. Copy `.env.example` to `.env`.
2. Install dependencies from the repo root with `cmd /c npm install`.
3. Start PostgreSQL with `docker compose up -d postgres` if you want the database locally available.
4. Run the backend with `cmd /c npm run dev:backend`.
5. Run the admin panel with `cmd /c npm run dev:admin`.

## Flutter apps
Flutter is not installed in the current workspace environment, so the source is included but not executed here.

When Flutter is available:
1. `cd apps/customer_app && flutter pub get && flutter run`
2. `cd apps/driver_app && flutter pub get && flutter run`

## Demo access
- Admin phone: `9000000001`
- Customer phone: `9000000002`
- Driver phone: `9000000003`
- Mock OTP: `123456`
