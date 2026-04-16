# Phase 7 Pilot Launch Preparation

## Status
- Phase 7 is in progress.
- Chunk 7.1 deployment readiness is delivered for Version 1.
- Chunk 7.2 pilot configuration readiness is delivered for Version 1.

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

## Version 1 deployment boundary
- PostgreSQL, backend, and admin web can run in a production-like stack
- External providers remain mock, dev, or local for Version 1
- Flutter customer and driver apps are still distributed separately outside the Compose stack

## Next launch-prep chunks
- Chunk 7.3 operations handbook
- Chunk 7.4 launch and rehearsal playbooks
- Chunk 7.5 monitoring and incident response
- Chunk 7.6 Version 1 sign-off package
