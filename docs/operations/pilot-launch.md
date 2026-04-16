# Pilot Launch Notes

## Version 1 launch policy
- Pilot launch stays on mock, dev, or local adapters for external services wherever possible so the team can validate operations without vendor lock-in.
- OTP stays on the mock development flow unless a pilot-specific SMS provider is explicitly approved later.
- Maps remain landmark-first with local pricing and routing logic for Version 1.
- Payment remains cash and UPI record-tracking in Version 1 rather than real gateway collection.
- Real provider onboarding is deferred to Version 2 after MVP workflows, admin operations, and pilot learnings are stable.
- Legal texts for Version 1 are maintained in [docs/legal/README.md](/e:/MyProjects/Cab%20Booking%20Service/docs/legal/README.md) and must be reviewed by qualified legal counsel before public commercial rollout.

## Suggested pilot footprint
- Railway Station
- Bus Stand
- Main Market
- Hospital Area

## Approved Version 1 pilot configuration
- Use [version1-pilot-configuration.md](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/version1-pilot-configuration.md) as the launch baseline.
- Use [config/version1-pilot-config.json](/e:/MyProjects/Cab%20Booking%20Service/config/version1-pilot-config.json) as the machine-readable source of truth.
- Before rehearsal or launch sign-off, run:
  - `powershell -ExecutionPolicy Bypass -File .\scripts\show-version1-pilot-config.ps1`

## Starting fleet
- 10 bike drivers
- 10 e-rickshaw drivers

## Operational focus
- Monitor cancellation rate
- Watch pickup delay trends
- Validate fare comfort for short trips
- Gather support reasons and route demand
