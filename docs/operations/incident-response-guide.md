# Version 1 Incident Response Guide

Last updated: April 16, 2026

Use this guide when the pilot experiences a service disruption, unsafe event, or major operational inconsistency.

## Incident severity
### Severity 1
- backend unavailable
- admin panel unavailable
- booking impossible for multiple users
- unresolved safety, fraud, or abuse situation

### Severity 2
- repeated ride lifecycle inconsistencies
- repeated payment-completion mismatch
- repeated complaint backlog beyond the target SLA
- major fare misconfiguration

### Severity 3
- isolated operator confusion
- one-off ride anomaly
- non-blocking UX issue

## First response steps
1. Record the incident in the incident log.
2. Confirm the time and affected surfaces.
3. Classify severity.
4. Pause new pilot activity if rider safety or core ride correctness is at risk.
5. Notify the launch lead.

## Investigation flow
1. Confirm whether the issue is:
   - runtime failure
   - configuration mistake
   - data inconsistency
   - user misuse or abuse
2. Check health endpoint.
3. Check admin dashboard and the affected ride, complaint, or driver records.
4. Compare the issue with the approved pilot configuration and SOPs.
5. Decide whether to continue, pause, or roll back.

## Required escalation
- safety allegation
- harassment or abuse
- fraud suspicion
- repeated data mismatch affecting payouts or fares
- persistent booking failure

## Recovery rule
- recover one issue at a time
- do not apply multiple emergency changes without documenting them
- verify service after each corrective step

## Resume criteria
- root issue understood enough to control risk
- affected surface re-verified
- incident log updated
- launch lead approves resumption
