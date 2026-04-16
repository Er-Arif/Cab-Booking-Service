# Phase 4 Mobile Build

## Status
- Phase 4 is complete for the MVP mobile milestone.
- Both customer and driver apps now use the live backend instead of demo-only services.
- Session restore, polling-based ride sync, history, profile, and issue flows are all wired.

## Customer app delivered
- OTP login against the backend auth service
- Persistent session restore and logout with refresh-token revocation
- Landmark loading from backend service zones and seeded Madhupur landmarks
- Fare estimation against the pricing API
- Ride creation with category, payment method, and address notes
- Active ride polling through the scoped customer ride endpoint
- Ride history screen backed by live customer history data
- Complaint submission for the active ride
- Profile view and profile update flow with preferred payment method

## Driver app delivered
- OTP login against the backend auth service
- Persistent session restore and logout with refresh-token revocation
- Driver profile sync from backend
- Online and offline availability updates
- Assigned ride/request visibility from live backend data
- Active ride polling through the scoped driver ride endpoint
- Driver ride lifecycle actions:
  - driver arriving
  - driver arrived
  - trip started
  - trip completed
  - payment completed
- Earnings summary and trip history from live backend data
- Driver issue reporting for the active trip

## Synchronization model
- Phase 4 uses polling-based state sync every 8 seconds for mobile safety and simplicity.
- Customer and driver apps both refresh their active ride, history, and related dashboard data from scoped endpoints.
- This keeps the MVP stable while Phase 5 admin work and later realtime enhancements continue.

## Verification
- Customer app web build passed
- Driver app web build passed
- Backend typecheck passed after the mobile-facing route updates
- Backend tests passed after the mobile-facing route updates
- Backend production build passed

## Remaining mobile improvements after Phase 4
- Replace polling with socket-driven ride sync where useful
- Add driver document upload and registration completion flow
- Add ride rating after payment completion
- Add background location updates for production dispatch accuracy
- Add richer offline handling and token refresh rotation in-app
