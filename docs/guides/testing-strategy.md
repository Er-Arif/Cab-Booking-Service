# Testing Strategy

## Version 1 approach
- Use automated tests where the stack is stable and fast to verify locally.
- Keep external-provider-dependent flows on mock, dev, or local adapters so tests stay deterministic.
- Combine automated coverage with a small manual smoke checklist for launch-critical journeys.

## Automated coverage

### Backend
- OTP auth flow
- Ride booking and dispatch happy path
- Ride lifecycle and payment completion
- Complaint creation and admin resolution
- Scoped ride visibility for customer, driver, and admin roles
- Admin mutations for driver verification and fare updates

Run with:
- `cmd /c npm --workspace apps/backend test`

### Customer app
- Login-screen smoke test
- Authenticated shell smoke test with seeded landmarks and profile state

Run with:
- `puro flutter test` from `apps/customer_app`

### Driver app
- Login-screen smoke test
- Authenticated shell smoke test with seeded driver profile state

Run with:
- `puro flutter test` from `apps/driver_app`

### Admin web
- Production build verification
- Type-safe live API integration verification through Next.js build

Run with:
- `cmd /c npm --workspace apps/admin_web run build`

## Manual smoke checklist
- Customer login with seeded phone and OTP
- Driver login with seeded phone and OTP
- Customer fare estimate and ride booking
- Driver sees assigned ride and completes lifecycle
- Payment completion updates earnings and reports
- Admin panel login and dashboard load
- Admin resolves a complaint
- Admin changes a driver status
- Admin updates a fare category

## Gaps intentionally left for later
- Full end-to-end browser automation
- Socket and background-location stress testing
- Real provider sandbox testing for OTP, maps, push, storage, and payments
- CI pipeline enforcement
