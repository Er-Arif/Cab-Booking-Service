# Version 1 Operations Handbook

Last updated: April 16, 2026

This handbook defines how operators should run the Madhupur Ride Booking Platform during the Version 1 pilot.

## Purpose
- keep the pilot stable and repeatable
- ensure consistent handling of drivers, customers, complaints, fares, and payouts
- align all operators to the same Version 1 boundaries

## Version 1 operating boundary
- OTP remains mock or local
- maps remain landmark-first with local pricing and routing logic
- payments remain cash and UPI record-tracking only
- legal templates remain Version 1 pilot documents pending lawyer review

## Daily operator routine
1. Confirm runtime health:
   - backend health endpoint responds
   - admin panel loads
   - seeded launch config matches the approved pilot configuration
2. Review active rides and recent cancellations.
3. Review driver availability and approval state.
4. Review unresolved complaints.
5. Confirm fare settings still match the approved pilot baseline.
6. Review the previous day or shift settlement notes.

## Core operator responsibilities
- keep launch geography and fares aligned to the approved baseline
- approve or hold driver onboarding decisions
- monitor ride flow and support escalations
- resolve or route complaints within the Version 1 SLA
- record payout and commission numbers accurately
- document incidents and pilot learnings for Version 2

## Required companion SOPs
- Driver onboarding: [driver-onboarding-sop.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/driver-onboarding-sop.md)
- Complaint handling: [complaint-handling-sop.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/complaint-handling-sop.md)
- Fare management: [fare-management-sop.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/fare-management-sop.md)
- Payout and revenue tracking: [payout-revenue-sop.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/payout-revenue-sop.md)
- Admin panel usage: [admin-panel-usage.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/admin-panel-usage.md)
- Monitoring checklist: [monitoring-checklist.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/monitoring-checklist.md)
- Incident response guide: [incident-response-guide.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/incident-response-guide.md)
- Incident log template: [incident-log-template.md](/e:/MyProjects/Cab%20Booking%20Service/docs/operations/incident-log-template.md)

## Escalation rule
- If an operator cannot safely resolve an issue through the approved SOPs, the issue should be recorded in the pilot log and escalated to the project owner before continuing with a risky change.
