# Version 1 Pre-Launch Checklist

Last updated: April 16, 2026

Use this checklist 24 to 48 hours before a pilot launch or controlled demo event.

## Environment and runtime
- confirm `.env` or production-like environment values are correct
- confirm PostgreSQL is reachable
- confirm backend health endpoint returns success
- confirm admin panel loads successfully
- confirm customer and driver build artifacts are ready if web-distributed for the pilot

## Configuration
- run [show-version1-pilot-config.ps1](/e:/MyProjects/Cab%20Booking%20Service/scripts/show-version1-pilot-config.ps1)
- confirm landmarks, zones, fares, commission, and complaint SLA match the approved pilot baseline
- confirm no unapproved fare changes are pending

## Accounts and access
- confirm admin seeded access works
- confirm seeded customer and driver access still work
- confirm operators know which numbers and OTP are used for the pilot

## Legal and compliance
- confirm the Version 1 legal pack is present and accessible
- confirm operator team understands these are pilot templates pending lawyer review
- confirm the pilot boundary for mock or local providers is understood and not misrepresented

## Test and rehearsal
- run [verify-version1.ps1](/e:/MyProjects/Cab%20Booking%20Service/scripts/verify-version1.ps1)
- run [demo-flow.ps1](/e:/MyProjects/Cab%20Booking%20Service/scripts/demo-flow.ps1) with backend running
- complete the [version1-launch-rehearsal.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/version1-launch-rehearsal.md) flow

## Go or no-go rule
- if a core flow fails, do not launch
- if the pilot baseline does not match the approved configuration, do not launch
- if operator roles are unclear, do not launch
