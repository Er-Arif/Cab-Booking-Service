import express from "express";

import { env } from "./config/env";
import { bootstrapDatabase } from "./db/bootstrap";
import { getSharedPool, type Queryable } from "./db/pool";
import { PlatformRepository } from "./db/repository";
import {
  MockFileStorageProvider,
  MockMapsProvider,
  MockOtpProvider,
  MockPushProvider,
} from "./domain/providers/mockProviders";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { commonSecurityMiddleware } from "./middleware/security";
import { buildAdminRouter } from "./modules/admin/admin.routes";
import { buildAuthRouter } from "./modules/auth/auth.routes";
import { AuthService } from "./modules/auth/auth.service";
import { buildCustomerRouter } from "./modules/customer/customer.routes";
import { buildDriverRouter } from "./modules/driver/driver.routes";
import { buildNotificationsRouter } from "./modules/notifications/notifications.routes";
import { buildPricingRouter } from "./modules/pricing/pricing.routes";
import { PricingService } from "./modules/pricing/pricing.service";
import { buildReportingRouter } from "./modules/reporting/reporting.routes";
import { buildRideRouter } from "./modules/ride/ride.routes";
import { RideService } from "./modules/ride/ride.service";

export async function createApp(options?: { db?: Queryable; bootstrap?: boolean }) {
  const app = express();
  commonSecurityMiddleware().forEach((middleware) => app.use(middleware));

  const db = options?.db ?? getSharedPool();
  if (options?.bootstrap !== false) {
    await bootstrapDatabase(db);
  }

  const repository = new PlatformRepository(db);
  const otpProvider = new MockOtpProvider();
  const mapsProvider = new MockMapsProvider();
  const pushProvider = new MockPushProvider();
  const fileStorageProvider = new MockFileStorageProvider();
  void fileStorageProvider;

  const authService = new AuthService(otpProvider, repository);
  const pricingService = new PricingService(mapsProvider, repository);
  const rideService = new RideService(pricingService, repository, pushProvider);

  app.get("/health", async (_req, res) => {
    res.json({
      status: "ok",
      environment: env.nodeEnv,
      providers: {
        otp: env.otpProvider,
        maps: env.mapsProvider,
        push: env.pushProvider,
        fileStorage: env.fileStorageProvider,
      },
    });
  });

  app.use("/api/auth", buildAuthRouter(authService));
  app.use("/api/pricing", buildPricingRouter(pricingService));
  app.use("/api/rides", buildRideRouter(rideService));
  app.use("/api/customer", buildCustomerRouter(repository));
  app.use("/api/driver", buildDriverRouter(repository));
  app.use("/api/admin", buildAdminRouter(repository));
  app.use("/api/reporting", buildReportingRouter(repository));
  app.use("/api/notifications", buildNotificationsRouter(pushProvider));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, db };
}
