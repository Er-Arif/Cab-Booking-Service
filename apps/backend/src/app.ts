import cors from "cors";
import express from "express";

import { env } from "config/env";
import {
  MockFileStorageProvider,
  MockMapsProvider,
  MockOtpProvider,
  MockPushProvider,
} from "domain/providers/mockProviders";
import { buildAdminRouter } from "modules/admin/admin.routes";
import { buildAuthRouter } from "modules/auth/auth.routes";
import { AuthService } from "modules/auth/auth.service";
import { buildCustomerRouter } from "modules/customer/customer.routes";
import { buildDriverRouter } from "modules/driver/driver.routes";
import { buildNotificationsRouter } from "modules/notifications/notifications.routes";
import { buildPricingRouter } from "modules/pricing/pricing.routes";
import { PricingService } from "modules/pricing/pricing.service";
import { buildReportingRouter } from "modules/reporting/reporting.routes";
import { buildRideRouter } from "modules/ride/ride.routes";
import { RideService } from "modules/ride/ride.service";

export function createApp() {
  const app = express();
  app.use(cors({ origin: env.adminWebOrigin }));
  app.use(express.json());

  const otpProvider = new MockOtpProvider();
  const mapsProvider = new MockMapsProvider();
  const pushProvider = new MockPushProvider();
  const fileStorageProvider = new MockFileStorageProvider();

  void fileStorageProvider;

  const authService = new AuthService(otpProvider);
  const pricingService = new PricingService(mapsProvider);
  const rideService = new RideService(pricingService, pushProvider);

  app.get("/health", (_req, res) => {
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
  app.use("/api/customer", buildCustomerRouter());
  app.use("/api/driver", buildDriverRouter());
  app.use("/api/admin", buildAdminRouter());
  app.use("/api/reporting", buildReportingRouter());
  app.use("/api/notifications", buildNotificationsRouter(pushProvider));

  return app;
}
