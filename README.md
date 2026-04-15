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

## Documentation
- Documentation index: [docs/README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/README.md)
- Product blueprint source: [madhupur_ride_booking_app_blueprint.md](/e:/MyProjects/Cab%20Booking%20Service/madhupur_ride_booking_app_blueprint.md)

## MVP defaults
- Ride categories: bike, e-rickshaw
- Revenue model: commission per ride
- Dispatch rule: nearest-first
- Payment methods: cash and UPI record-tracking
- External integrations: mockable provider interfaces for OTP, maps, notifications, and file storage
