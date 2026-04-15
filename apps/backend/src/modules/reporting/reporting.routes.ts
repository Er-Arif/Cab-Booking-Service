import { Router } from "express";

import { PlatformRepository } from "../../db/repository";
import { requireAuth } from "../common/auth";

export function buildReportingRouter(repository: PlatformRepository) {
  const router = Router();

  router.get("/health", requireAuth("admin"), async (_req, res, next) => {
    try {
      const [drivers, rides, complaints] = await Promise.all([
        repository.listDrivers(),
        repository.listRides(),
        repository.listComplaints(),
      ]);

      res.json({
        driversOnline: drivers.filter((driver: (typeof drivers)[number]) => driver.isOnline).length,
        ridesActive: rides.filter((ride: (typeof rides)[number]) =>
          ["driver_assigned", "driver_arriving", "driver_arrived", "trip_started"].includes(ride.status)
        ).length,
        complaintsOpen: complaints.filter((complaint: (typeof complaints)[number]) => complaint.resolutionStatus !== "resolved").length,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
