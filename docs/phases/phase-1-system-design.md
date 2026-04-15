# Phase 1 Product Planning

## Completed decisions
- Workspace monorepo with app surfaces plus shared packages
- Node.js backend with Express and Socket.io
- Admin web in Next.js App Router
- Flutter mobile source for customer and driver
- PostgreSQL-backed runtime as the source of truth for launch
- Mockable OTP, maps, push, and file storage providers for controlled rollout

## Finalized operating rules
- Small-city UX first
- Landmark-oriented booking
- Cash-first operations
- Admin-controlled pricing and service areas
- Contracts documented before vendor lock-in
- Commission model and complaint SLA fixed for launch planning

## Planning outputs
- Scope and MVP boundary documented in `docs/guides/product-scope.md`
- Final business rules documented in `docs/guides/business-rules.md`
- Shared business constants exported from `packages/shared-config`
