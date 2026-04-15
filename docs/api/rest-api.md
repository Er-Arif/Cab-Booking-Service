# REST API Catalog

## Public auth
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`

## Pricing
- `POST /api/pricing/estimate`

## Customer
- `GET /api/customer/profile`
- `PUT /api/customer/profile`
- `GET /api/customer/landmarks`
- `GET /api/customer/rides/history`
- `POST /api/customer/complaints`

## Rides
- `GET /api/rides`
- `POST /api/rides`
- `PATCH /api/rides/:rideId/status`
- `PATCH /api/rides/:rideId/payment`

## Driver
- `GET /api/driver/profile`
- `PATCH /api/driver/availability`
- `GET /api/driver/requests`
- `GET /api/driver/earnings`
- `GET /api/driver/history`
- `POST /api/driver/issues`

## Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/drivers`
- `GET /api/admin/customers`
- `GET /api/admin/rides`
- `GET /api/admin/complaints`
- `GET /api/admin/landmarks`
- `GET /api/admin/zones`
- `GET /api/admin/categories`
- `PATCH /api/admin/drivers/:driverId/status`
- `PATCH /api/admin/categories/:categoryId`
- `PATCH /api/admin/complaints/:complaintId`
- `GET /api/admin/reports/summary`

## Notifications and reporting
- `POST /api/notifications`
- `GET /api/reporting/health`
