# Environment Variables

## Backend
- `PORT`: API port, defaults to `4000`
- `JWT_SECRET`: signing secret for role-based auth
- `ADMIN_WEB_ORIGIN`: CORS origin for the admin web app
- `DATABASE_URL`: PostgreSQL connection string for future repository adapters
- `OTP_PROVIDER`: provider selector, defaults to `mock`
- `MAPS_PROVIDER`: provider selector, defaults to `mock`
- `PUSH_PROVIDER`: provider selector, defaults to `mock`
- `FILE_STORAGE_PROVIDER`: provider selector, defaults to `mock`

## Runtime philosophy
The current code uses mock adapters by default so the MVP can run end-to-end without vendor setup. Production integrations should implement the same provider interfaces.
