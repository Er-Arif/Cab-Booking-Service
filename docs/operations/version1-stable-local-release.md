# Version 1 Stable Local Release

This note marks the first locally verified stable release after end-to-end testing across all Version 1 surfaces.

## Verified surfaces
- Backend API on `http://localhost:4000`
- Admin web on `http://localhost:3000`
- Customer web build on `http://127.0.0.1:4100`
- Driver web build on `http://127.0.0.1:4200`

## Stability fixes included
- Docker and local PostgreSQL now avoid the default local port collision by using host port `5433`
- Backend CORS now supports the local admin, customer, and driver web origins
- Local dev rate limiting no longer blocks normal testing flows
- Customer ride booking payload handling is aligned with backend validation
- Driver ride status transitions no longer fail due to the SQL parameter mismatch
- Admin local data loading is more resilient, and the admin runtime was stabilized after a corrupted Next dev cache

## Intended use
- Local development
- Demo and rehearsal runs
- Controlled Version 1 pilot validation

## Boundaries
- Version 1 still uses mock, local, or dev adapters for external providers
- Real provider integrations remain part of the Version 2 plan
