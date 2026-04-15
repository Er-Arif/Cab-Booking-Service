# Seed Notes

The runtime backend uses in-memory seeded state for development speed while the SQL schema and seed files model the intended PostgreSQL deployment shape.

Future enhancement:
- Replace the in-memory store with repository adapters backed by PostgreSQL.
- Add migration tooling such as Prisma or Drizzle.
- Keep these seed records aligned with admin-managed defaults.
