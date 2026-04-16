# Deferred Roadmap

## Release strategy
- Version 1 uses mock, dev, or local adapters anywhere an external provider would normally be required so the entire platform stays runnable end-to-end without paid vendor dependencies.
- Version 1 keeps OTP, SMS, maps/routing, push notifications, document storage, and payment collection in mock or simplified local mode while the core business logic, PostgreSQL data model, and app workflows stabilize.
- Version 2 replaces those mock or dev adapters with real production services behind the existing provider interfaces.

## Version 2 provider rollout
- Real OTP and SMS gateway integration
- Real maps, geocoding, and routing provider integration
- Real push notification delivery for customer and driver apps
- Real document and file storage for driver onboarding and admin review
- Real payment and UPI gateway integration
- Stronger production realtime delivery beyond polling-only mobile sync

## Post-MVP features
- Scheduled rides
- Shared e-rickshaw rides
- Call-center operator bookings
- Wallet and auto payments
- Referral and promo engine
- Multilingual support
- In-app chat
- Subscription plans
- Parcel and medicine delivery

## Technical debt queue
- Vendor integration adapters
- Automated test suites
- CI pipeline
- Fine-grained admin permissions
