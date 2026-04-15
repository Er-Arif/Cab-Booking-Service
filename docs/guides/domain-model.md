# Domain Model and ERD Notes

## Core entities
- Customer: profile, emergency contact, payment preference
- Driver: vehicle type, verification state, online presence, rating, payout identity
- Ride category: pricing and operational rules for bike and e-rickshaw
- Ride: pickup/drop, notes, estimated fare, final fare, status lifecycle, payment state
- Complaint: ride-linked support issue with resolution state
- Service zone and landmark: small-city routing anchors and operational boundaries

## Lifecycle enums
- Ride status: requested, searching, assigned, arriving, arrived, started, completed, cancelled variants, payment completed
- Payment status: pending, recorded, completed, failed
- Verification status: pending, approved, rejected, suspended
- Complaint status: open, in review, resolved, closed

## Storage approach
- `database/schema.sql` describes the intended relational structure
- backend runtime currently uses an in-memory seeded store for fast MVP iteration
- future work should replace the store with repository adapters against PostgreSQL
