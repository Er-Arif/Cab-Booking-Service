# Version 1 Acceptance Checklist

Use this checklist before calling Version 1 ready for a pilot or handoff.

## Automated checks
- [ ] `cmd /c npm --workspace apps/backend run typecheck`
- [ ] `cmd /c npm --workspace apps/backend test`
- [ ] `cmd /c npm --workspace apps/admin_web run build`
- [ ] `flutter test` in `apps/customer_app`
- [ ] `flutter test` in `apps/driver_app`
- [ ] `powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1`

## Backend acceptance
- [ ] Health endpoint returns provider status and environment correctly
- [ ] OTP send and verify flow works with seeded mock OTP
- [ ] Customer booking creates a persisted ride
- [ ] Driver can move a ride through the full lifecycle
- [ ] Payment completion records driver earnings and platform commission
- [ ] Complaint creation and admin resolution persist correctly
- [ ] Admin fare updates persist correctly

## Customer app acceptance
- [ ] Customer login works with seeded phone and OTP
- [ ] Landmark list loads from the backend
- [ ] Fare estimate works for bike and e-rickshaw
- [ ] Customer can create a ride
- [ ] Active ride view updates after booking
- [ ] Ride history loads from backend data
- [ ] Customer can submit a complaint from the app

## Driver app acceptance
- [ ] Driver login works with seeded phone and OTP
- [ ] Driver availability toggle persists
- [ ] Assigned ride appears in the app
- [ ] Driver can mark arriving, arrived, started, completed
- [ ] Driver can confirm payment completion
- [ ] Earnings and trip history update after a completed ride
- [ ] Driver can submit an issue from the app

## Admin panel acceptance
- [ ] Admin login works with seeded admin phone and OTP
- [ ] Dashboard shows live metrics
- [ ] Drivers page lists live fleet records
- [ ] Admin can change driver verification status
- [ ] Rides page reflects live persisted rides
- [ ] Complaints page can move a complaint to in-review or resolved
- [ ] Settings page can update live fare values
- [ ] Reports page reflects live summary data

## Version 1 boundaries
- [ ] OTP, SMS, maps, push, storage, and payment providers stay on mock, dev, or local adapters
- [ ] No Version 2 real-provider requirement is assumed during sign-off
