# Version 1 Launch Day Playbook

Last updated: April 16, 2026

Use this playbook on the day the pilot goes live.

## Before opening the pilot
1. Confirm backend and admin panel are running.
2. Confirm one operator has completed the pre-launch checklist.
3. Confirm one operator is assigned to support and complaints.
4. Confirm one operator is assigned to driver monitoring and onboarding issues.
5. Confirm seeded demo accounts are reserved for testing only and not mixed with real pilot participants.

## First 30 minutes
- monitor health endpoint
- review admin dashboard every 10 minutes
- confirm driver availability counts look reasonable
- confirm no critical complaints or failed ride states appear

## First live booking check
1. Confirm a customer can authenticate.
2. Confirm fare estimate works.
3. Confirm ride creation succeeds.
4. Confirm the driver sees the ride.
5. Confirm lifecycle updates reach completion.
6. Confirm payment and complaint flows remain operational.

## Operator roles during launch
- launch lead:
  - owns go or no-go decision
  - approves emergency operational changes
- support operator:
  - handles complaints, app confusion, and rider issues
- fleet operator:
  - tracks driver readiness, pending approvals, and availability
- records operator:
  - documents incidents, changes, and decisions in the pilot log

## During pilot hours
- review cancellations every hour
- review unresolved complaints every hour
- confirm fare settings have not changed unexpectedly
- record any manual interventions

## Stop conditions
- backend unavailable
- admin panel unavailable
- repeated booking failure
- repeated ride status inconsistency
- unresolved safety event

If any stop condition occurs, move to the rollback and fallback guide.
