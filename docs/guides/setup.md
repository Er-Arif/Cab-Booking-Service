# Setup Guide

## Node and admin/backend setup
1. Copy `.env.example` to `.env`.
2. Install dependencies from the repo root with `cmd /c npm install`.
3. Start PostgreSQL with `docker compose up -d postgres` if you want the database locally available.
4. Initialize the database with `cmd /c npm --workspace apps/backend run db:bootstrap`.
5. Run the backend with `cmd /c npm run dev:backend`.
6. Run the admin panel with `cmd /c npm run dev:admin`.

## Backend verification
- Typecheck: `cmd /c npm --workspace apps/backend run typecheck`
- Test: `cmd /c npm --workspace apps/backend test`
- Build: `cmd /c npm --workspace apps/backend run build`
- Full Version 1 verification: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1`
- Full Version 1 rehearsal: `powershell -ExecutionPolicy Bypass -File .\scripts\rehearse-version1.ps1`

## Flutter apps
Flutter is installed in the current workspace environment and both apps compile for web.

When Flutter is available:
1. `cd apps/customer_app && flutter pub get && flutter run`
2. `cd apps/driver_app && flutter pub get && flutter run`

## Demo access
- Admin phone: `9000000001`
- Customer phone: `9000000002`
- Driver phone: `9000000003`
- Mock OTP: `123456`

## Deployment readiness
- Production-like deployment guide: [deployment.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/deployment.md)
- Version 1 deployment stack: `docker compose --env-file .env.production -f docker-compose.version1.yml up --build -d`
