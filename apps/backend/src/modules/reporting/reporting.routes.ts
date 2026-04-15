import { Router } from "express";

import { requireAuth } from "modules/common/auth";
import { store } from "modules/common/store";

export function buildReportingRouter() {
  const router = Router();

  router.get("/health", requireAuth("admin"), (_req, res) => {
    res.json({
      driversOnline: store.drivers.filter((driver) => driver.isOnline).length,
      ridesActive: store.rides.filter((ride) =>
        ["driver_assigned", "driver_arriving", "driver_arrived", "trip_started"].includes(ride.status)
      ).length,
      complaintsOpen: store.complaints.filter((complaint) => complaint.resolutionStatus !== "resolved").length,
    });
  });

  return router;
}
