# Phase 6 Testing and Launch Prep

## Status
- Phase 6 is complete for the Version 1 milestone.
- Automated backend coverage is expanded and both Flutter apps now have real widget smoke tests instead of the default template counter tests.
- The testing strategy, Version 1 acceptance checklist, and repeatable verification script are documented for the team.
- GitHub Actions CI now verifies backend, admin web, and Flutter smoke coverage on pushes and pull requests.
- The local one-command verification path now passes end to end through `scripts/verify-version1.ps1`.
- The full launch rehearsal path is documented and scripted through `scripts/rehearse-version1.ps1`.

## Automated verification now in place
- Backend integration tests for:
  - OTP authentication
  - ride happy path
  - payment completion
  - complaint creation and resolution
  - scoped ride visibility by role
  - admin updates for driver verification and fare configuration
- Customer Flutter widget smoke tests for:
  - login state
  - authenticated app shell state
- Driver Flutter widget smoke tests for:
  - login state
  - authenticated app shell state
- Admin web production build verification
- Root verification script:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1`
- Root rehearsal script:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\rehearse-version1.ps1`
- GitHub Actions workflow:
  - `.github/workflows/version1-ci.yml`

## Version boundary
- Version 1 testing and launch prep assumes mock, dev, or local adapters for OTP, SMS, maps, push, storage, and payment-provider behavior.
- Version 2 is the milestone where those provider-facing flows move to real production services and require staging or sandbox verification against live vendors.

## Immediate verification targets
- Root install and workspace scripts
- Backend health endpoint
- OTP send and verify flow
- Fare estimation and booking flow
- Admin web render and live admin actions
- Customer and driver app smoke tests
- SQL schema load through Docker PostgreSQL

## Current pilot readiness checklist
- Verify driver document rules
- Confirm pilot fares with operators
- Seed launch landmarks
- Dry-run station and market routes
- Define complaint SLA and payout schedule
- Rehearse seeded admin, customer, and driver login flows
- Rehearse complaint resolution and fare update from the admin panel
- Use the Version 1 acceptance checklist for sign-off
- Use the Version 1 launch rehearsal runbook for pre-pilot validation

## Phase 6 close-out
- Version 1 now has:
  - automated backend integration coverage
  - Flutter smoke tests for both apps
  - admin production build verification
  - root verification tooling
  - CI workflow definition
  - acceptance checklist
  - full launch rehearsal runbook
- Remaining future enhancements belong to later hardening or pilot-operations work, not Phase 6 scope for Version 1.
