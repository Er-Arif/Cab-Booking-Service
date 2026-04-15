# Environment Variables

## Backend
- `PORT`: API port, defaults to `4000`
- `JWT_SECRET`: signing secret for role-based auth
- `JWT_ISSUER`: issuer claim for signed tokens
- `JWT_AUDIENCE`: audience claim for signed tokens
- `ACCESS_TOKEN_TTL_MINUTES`: access token lifetime
- `REFRESH_TOKEN_TTL_DAYS`: refresh token lifetime
- `ADMIN_WEB_ORIGIN`: CORS origin for the admin web app
- `DATABASE_URL`: PostgreSQL connection string for future repository adapters
- `OTP_PROVIDER`: provider selector, defaults to `mock`
- `MAPS_PROVIDER`: provider selector, defaults to `mock`
- `PUSH_PROVIDER`: provider selector, defaults to `mock`
- `FILE_STORAGE_PROVIDER`: provider selector, defaults to `mock`
- `MOCK_OTP_CODE`: fixed development OTP for mock auth flow
- `RATE_LIMIT_WINDOW_MS`: global rate-limit window
- `RATE_LIMIT_MAX_REQUESTS`: global request cap within the window
- `AUTH_RATE_LIMIT_MAX_REQUESTS`: stricter auth endpoint request cap

## Runtime philosophy
The current code uses mock adapters by default so the MVP can run end-to-end without vendor setup. Production integrations should implement the same provider interfaces, while the persisted PostgreSQL layer remains the production data source.
