# Version 1 Deployment Guide

This guide covers deployment readiness for Version 1 within the approved project boundary:
- backend, admin web, and PostgreSQL can run in a production-like setup
- external providers remain on mock, dev, or local adapters

## Deployment surfaces
- Backend API: `apps/backend`
- Admin web: `apps/admin_web`
- Database: PostgreSQL 16

## Files used
- Compose stack: [docker-compose.version1.yml](/e:/MyProjects/Cab%20Booking%20Service/docker-compose.version1.yml)
- Backend image: [apps/backend/Dockerfile](/e:/MyProjects/Cab%20Booking%20Service/apps/backend/Dockerfile)
- Admin image: [apps/admin_web/Dockerfile](/e:/MyProjects/Cab%20Booking%20Service/apps/admin_web/Dockerfile)
- Production-like env template: [.env.production.example](/e:/MyProjects/Cab%20Booking%20Service/.env.production.example)

## Startup order
1. Prepare `.env.production` from `.env.production.example`
2. Start PostgreSQL
3. Start backend
4. Start admin web
5. Verify health endpoint and admin login

## Production-like environment setup
Copy `.env.production.example` to `.env.production` and replace at minimum:
- `JWT_SECRET`
- `POSTGRES_PASSWORD`
- `DATABASE_URL` if your database host differs
- `ADMIN_WEB_ORIGIN` if your admin panel host differs
- `NEXT_PUBLIC_API_BASE_URL` if your backend host differs

Version 1 should keep:
- `OTP_PROVIDER=mock`
- `MAPS_PROVIDER=mock`
- `PUSH_PROVIDER=mock`
- `FILE_STORAGE_PROVIDER=mock`

## Docker Compose deployment
From the repo root:

```powershell
Copy-Item .env.production.example .env.production
```

```powershell
docker compose --env-file .env.production -f docker-compose.version1.yml up --build -d
```

## Post-start verification
- Backend health: `http://localhost:4000/health`
- Admin web: `http://localhost:3000`
- Admin login:
  - phone: `9000000001`
  - OTP: `123456`

## Recommended local release verification before deployment

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-version1.ps1
```

## Backup and restore basics

### Backup
Use `pg_dump` against the running database:

```powershell
docker exec madhupur_postgres pg_dump -U postgres -d madhupur_rides > madhupur_rides_backup.sql
```

### Restore
Create a fresh database and restore into it:

```powershell
Get-Content .\madhupur_rides_backup.sql | docker exec -i madhupur_postgres psql -U postgres -d madhupur_rides
```

## Version 1 deployment notes
- This deployment is suitable for controlled pilot usage and operational rehearsal.
- It is not a full production hardening package because real OTP, maps, push, storage, and payment providers are intentionally deferred to Version 2.
- Flutter customer and driver apps remain distributed and run separately from this Compose stack.

## Operational checks after deployment
- Health endpoint returns `status: ok`
- Admin dashboard loads live data
- Demo flow can complete successfully
- Complaint resolution and fare update actions persist
