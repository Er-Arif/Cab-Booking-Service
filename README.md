# Madhupur Ride Booking Platform

Cloud-ready MVP monorepo for a hyperlocal ride-booking platform serving Madhupur, Jharkhand.

## Surfaces
- `apps/backend`: Node.js + Express + Socket.io API with mockable providers and seeded demo state
- `apps/admin_web`: Next.js admin panel for operations, fare management, rides, and reporting
- `apps/customer_app`: Flutter customer mobile app
- `apps/driver_app`: Flutter driver mobile app
- `packages/shared-types`: Shared TypeScript contracts for the backend and admin web
- `packages/shared-config`: Shared constants and seeded business defaults

## Quick start
1. Install Node dependencies from the repo root:
   `cmd /c npm install`
2. Copy `.env.example` to `.env`
3. Start PostgreSQL:
   `docker compose up -d postgres`
4. Bootstrap the database:
   `cmd /c npm --workspace apps/backend run db:bootstrap`
5. Start the backend:
   `cmd /c npm run dev:backend`
6. Start the admin web:
   `cmd /c npm run dev:admin`
7. Build the Flutter apps for web:
   `powershell -ExecutionPolicy Bypass -File .\scripts\run-customer-web.ps1`
   `powershell -ExecutionPolicy Bypass -File .\scripts\run-driver-web.ps1`
8. Review Flutter setup in [docs/guides/flutter-setup.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/flutter-setup.md).

## Backend verification
- Typecheck: `cmd /c npm --workspace apps/backend run typecheck`
- Test: `cmd /c npm --workspace apps/backend test`
- Build: `cmd /c npm --workspace apps/backend run build`

## Frontend and mobile verification
- Admin web build: `cmd /c npm --workspace apps/admin_web run build`
- Customer Flutter tests: `puro flutter test` from `apps/customer_app`
- Driver Flutter tests: `puro flutter test` from `apps/driver_app`
- Customer Flutter web build: `powershell -ExecutionPolicy Bypass -File .\scripts\run-customer-web.ps1`
- Driver Flutter web build: `powershell -ExecutionPolicy Bypass -File .\scripts\run-driver-web.ps1`
- Full Version 1 verification: `powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1`
- Full Version 1 rehearsal: `powershell -ExecutionPolicy Bypass -File .\scripts\rehearse-version1.ps1`

## Documentation
- Documentation index: [docs/README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/README.md)
- Product blueprint source: [madhupur_ride_booking_app_blueprint.md](/e:/MyProjects/Cab%20Booking%20Service/madhupur_ride_booking_app_blueprint.md)
- Deployment guide: [docs/guides/deployment.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/deployment.md)
- Legal pack: [docs/legal/README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/legal/README.md)
- Operations handbook: [docs/operations/operations-handbook.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/operations-handbook.md)
- Version 1 sign-off: [docs/operations/version1-signoff-report.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/version1-signoff-report.md)
- Stable local release note: [docs/operations/version1-stable-local-release.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/version1-stable-local-release.md)

## MVP defaults
- Ride categories: bike, e-rickshaw
- Revenue model: commission per ride
- Dispatch rule: nearest-first
- Payment methods: cash and UPI record-tracking
- External integrations: mockable provider interfaces for OTP, maps, notifications, and file storage
- Legal posture: Version 1 uses internal pilot legal templates that require lawyer review before wider public launch

## Current release status
- Version 1 scope is complete and pilot-ready within the approved mock, local, and dev-provider boundaries
- Version 2 is the planned milestone for real provider integrations and broader production hardening
