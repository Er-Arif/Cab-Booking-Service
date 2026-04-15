# Realtime Event Catalog

## Stable event names
- `driver.request.received`
- `driver.request.expired`
- `ride.assigned`
- `ride.location.updated`
- `ride.status.changed`
- `ride.cancelled`

## Current implementation
- Socket room join: `ride:join`
- Driver location emission: `driver:location`
- Broadcast payload: `ride.location.updated`

## Next backend step
Expand the Socket.io layer so ride assignment, expiry, and lifecycle updates emit the full documented contract rather than location-only updates.
