# Version 1 Monitoring Checklist

Last updated: April 16, 2026

Use this checklist during the pilot to detect issues early and keep the platform stable.

## What to monitor first
- backend health endpoint
- admin panel availability
- booking success
- ride lifecycle consistency
- driver availability coverage
- unresolved complaints
- payment-complete rate

## Health checks
### Backend
- open `http://localhost:4000/health`
- confirm:
  - `status` is `ok`
  - environment is correct
  - provider mode still matches Version 1 boundaries

### Admin panel
- open `http://localhost:3000`
- confirm login page or dashboard loads without errors

## Hourly operator review
- check active rides
- check recent cancellations
- check newly created complaints
- check drivers pending approval
- check settings page for unexpected fare changes

## Warning signs
- repeated OTP verification confusion beyond the expected mock flow
- multiple ride bookings failing in a short window
- drivers not receiving expected assigned rides
- ride status stuck between requested and completion
- complaints increasing faster than ride volume
- earnings or payment totals looking inconsistent

## Daily closeout review
- count completed rides
- count cancellations
- count unresolved complaints
- count unresolved payment issues
- record any incidents in the incident log

## Version 1 note
- since external providers remain mock, local, or dev-backed, operators should focus on platform behavior, config correctness, state consistency, and internal workflow reliability
