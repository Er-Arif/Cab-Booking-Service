# Product Scope and MVP Clarification

## Product goal
Build a practical ride-booking platform for Madhupur that serves local customer needs with bike and e-rickshaw rides while giving the operator strong control over dispatch, fares, verification, and support.

## Included in this repository
- Node.js backend with REST and Socket.io contracts
- Next.js admin dashboard
- Flutter customer app source
- Flutter driver app source
- Shared domain contracts and seeded defaults
- Database schema and PostgreSQL seed references
- Phase-based living documentation

## MVP boundaries
- Included: OTP-style auth flow, fare estimation, ride booking, dispatch assignment, ride lifecycle, payment marking, complaints, driver availability, admin dashboards, landmarks, zones, reports
- Deferred: scheduled rides, shared rides, referral, wallet, subscription plans, multilingual support, in-app chat, operator call booking

## Default business rules
- Dispatch rule: nearest-first
- Revenue rule: 15 percent commission per completed ride
- Payment methods: cash and UPI
- Service area: seeded Madhupur pilot zones and landmarks
