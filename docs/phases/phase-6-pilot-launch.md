# Phase 7 Pilot Launch Preparation

## Status
- Phase 7 is complete for the Version 1 scope.
- Chunks 7.1 through 7.6 are delivered.

## Chunk 7.1 delivered
- Backend Docker image scaffold
- Admin web Docker image scaffold
- Version 1 Compose stack for PostgreSQL, backend, and admin web
- Production-like environment template for deployment
- Deployment guide with startup order, verification, and backup or restore basics

## Chunk 7.2 delivered
- Machine-readable Version 1 pilot configuration artifact
- Pilot configuration guide covering launch zones, landmarks, fares, seeded access, and ops defaults
- Pilot launch doc updated to reference the approved launch baseline
- Quick summary script for operators and QA to confirm the approved pilot configuration

## Legal and compliance baseline added
- Version 1 legal pack added under `docs/legal`
- Terms and Conditions, Privacy Policy, Customer Agreement, and Driver Agreement now exist as pilot templates
- Customer, driver, and admin sign-in surfaces now reference the legal pack and Version 1 pilot boundary
- The repo now explicitly distinguishes internal pilot-ready legal templates from final lawyer-reviewed production documents

## Chunk 7.3 delivered
- Operations handbook added for daily pilot operation
- Driver onboarding SOP added
- Complaint handling SOP added with service targets and escalation rules
- Fare management SOP added
- Payout and revenue tracking SOP added
- Admin panel usage guide added for operators

## Chunk 7.4 delivered
- Pre-launch checklist added
- Launch day playbook added
- Post-launch review guide added
- Rollback and fallback guide added
- Launch rehearsal guide updated to reference the new launch playbook set

## Chunk 7.5 delivered
- Monitoring checklist added for hourly and daily pilot checks
- Incident response guide added with severity levels, response flow, and resume criteria
- Incident log template added for consistent event recording
- Operations handbook and pilot launch docs updated to link the monitoring and incident set

## Chunk 7.6 delivered
- Version 1 sign-off report added
- Known limitations document added
- Risk register added
- Future-development handoff note added
- Version 2 transition plan added
- Pilot launch and documentation index updated to link the closure package

## Version 1 deployment boundary
- PostgreSQL, backend, and admin web can run in a production-like stack
- External providers remain mock, dev, or local for Version 1
- Flutter customer and driver apps are still distributed separately outside the Compose stack

## Next step
- Version 1 pilot execution within the approved boundary
- Version 2 planning after pilot learnings
