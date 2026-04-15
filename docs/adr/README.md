# Architecture Decision Records

## ADR-001: Monorepo
Use one monorepo so backend, admin web, mobile apps, shared contracts, and docs evolve together.

## ADR-002: Mockable providers
Hide OTP, maps, notifications, and storage behind interfaces so the MVP works immediately and production vendors can be swapped in later.

## ADR-003: In-memory runtime with SQL target
Use an in-memory runtime store for the first implementation pass, while documenting and seeding the intended PostgreSQL schema for future persistence.
