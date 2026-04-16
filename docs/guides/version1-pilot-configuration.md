# Version 1 Pilot Configuration

This guide defines the approved operational baseline for the Version 1 pilot.

## Source of truth
- Machine-readable config: [config/version1-pilot-config.json](/e:/MyProjects/Cab%20Booking%20Service/config/version1-pilot-config.json)
- Quick summary script: [scripts/show-version1-pilot-config.ps1](/e:/MyProjects/Cab%20Booking%20Service/scripts/show-version1-pilot-config.ps1)
- Seed data: [database/seeds/seed.sql](/e:/MyProjects/Cab%20Booking%20Service/database/seeds/seed.sql)

## Version 1 boundary
- Provider mode stays mock, dev, or local.
- OTP remains mock.
- Maps remain landmark-first with local pricing and routing logic.
- Payments remain cash and UPI record-tracking only.

## Approved launch geography

### Service zones
- Railway Station
- Bus Stand
- Main Market
- Hospital Area

### Launch landmarks
- Madhupur Railway Station
- Bus Stand
- Main Market
- Hospital Area

## Approved ride categories and fares

### Bike
- Base fare: Rs 20
- Minimum fare: Rs 35
- Per km rate: Rs 9
- Per minute rate: Rs 1
- Waiting charge: Rs 2
- Cancellation fee: Rs 10
- Free waiting window: 3 minutes

### E-rickshaw
- Base fare: Rs 30
- Minimum fare: Rs 50
- Per km rate: Rs 12
- Per minute rate: Rs 1
- Waiting charge: Rs 3
- Cancellation fee: Rs 15
- Free waiting window: 5 minutes

## Approved seeded access
- Admin:
  - phone: `9000000001`
  - OTP: `123456`
- Customer:
  - phone: `9000000002`
  - OTP: `123456`
- Driver:
  - `Rakesh Yadav` / `9000000003` / `bike`
  - `Sanjay Das` / `9000000004` / `e_rickshaw`

## Operational defaults
- Platform commission: 15 percent
- Settlement cycle: weekly
- Complaint first response target: 4 hours
- Complaint resolution target: 24 hours

## Recommended pre-pilot check
Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\show-version1-pilot-config.ps1
```

Use the output to confirm:
- launch geography matches the seed data
- fares match admin settings
- seeded access numbers are correct
- operators are using the right Version 1 boundaries
