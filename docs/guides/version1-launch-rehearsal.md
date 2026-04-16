# Version 1 Launch Rehearsal

Use this guide to rehearse the full Version 1 product before pilot sign-off.

## Goal
- Confirm that backend, admin, customer, and driver surfaces work together with the Version 1 mock or local provider boundaries.
- Rehearse the exact seeded flows the team will use during demos, QA, and operator sign-off.

## Seeded access
- Admin phone: `9000000001`
- Customer phone: `9000000002`
- Driver phone: `9000000003`
- Mock OTP: `123456`

## Step 1: Run automated verification
From the repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1
```

This verifies:
- backend typecheck
- backend integration tests
- admin production build
- customer Flutter widget tests
- driver Flutter widget tests

## Step 2: Start runtime surfaces
In separate terminals:

```powershell
cmd /c npm run dev:backend
```

```powershell
cmd /c npm run dev:admin
```

Optional Flutter web builds:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-customer-web.ps1
```

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-driver-web.ps1
```

## Step 3: Run the backend full-flow rehearsal

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\demo-flow.ps1
```

This confirms:
- OTP login
- ride booking
- ride lifecycle progression
- payment completion
- complaint creation and resolution
- admin reporting updates

## Step 4: Manual admin rehearsal
Open:
- `http://localhost:3000`

Confirm:
- admin login succeeds with seeded credentials
- dashboard loads live metrics
- drivers page loads
- a driver status change persists
- complaints page resolves a complaint
- settings page saves pricing updates
- reports page reflects live summary data

## Step 5: Manual customer rehearsal
Confirm:
- customer login succeeds
- landmarks load
- fare estimate works
- booking works
- active ride appears
- history loads
- complaint submission works

## Step 6: Manual driver rehearsal
Confirm:
- driver login succeeds
- availability toggle works
- assigned ride appears
- arriving, arrived, started, completed, and payment-complete actions work
- earnings and history reflect the completed trip
- issue submission works

## Step 7: Final sign-off
Use:
- [Version 1 acceptance checklist](/e:/MyProjects/Cab%20Booking%20Service/docs/guides/version1-acceptance-checklist.md)

Optional all-in-one rehearsal helper:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\rehearse-version1.ps1
```
