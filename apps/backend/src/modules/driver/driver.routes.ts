import { Router } from "express";
import { z } from "zod";

import { requireAuth, type AuthRequest } from "modules/common/auth";
import { store } from "modules/common/store";

const availabilitySchema = z.object({
  isOnline: z.boolean(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

const issueSchema = z.object({
  rideId: z.string(),
  complaintType: z.string(),
  description: z.string().min(5),
});

export function buildDriverRouter() {
  const router = Router();

  router.get("/profile", requireAuth("driver"), (req: AuthRequest, res) => {
    const driver = store.drivers.find((item) => item.id === req.user!.id);
    res.json(driver);
  });

  router.patch("/availability", requireAuth("driver"), (req: AuthRequest, res) => {
    const payload = availabilitySchema.parse(req.body);
    const driver = store.drivers.find((item) => item.id === req.user!.id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.isOnline = payload.isOnline;
    if (payload.location) {
      driver.currentLocation = payload.location;
    }
    return res.json(driver);
  });

  router.get("/requests", requireAuth("driver"), (req: AuthRequest, res) => {
    res.json(
      store.rides.filter(
        (ride) => ride.driverId === req.user!.id && ["driver_assigned", "driver_arriving"].includes(ride.status)
      )
    );
  });

  router.get("/earnings", requireAuth("driver"), (req: AuthRequest, res) => {
    const rides = store.rides.filter((ride) => ride.driverId === req.user!.id && ride.paymentStatus === "completed");
    const total = rides.reduce((sum, ride) => sum + (ride.finalFare ?? ride.estimatedFare), 0);
    res.json({
      totalCompletedRides: rides.length,
      grossCollected: total,
      pendingPayout: Number((total * 0.85).toFixed(2)),
    });
  });

  router.get("/history", requireAuth("driver"), (req: AuthRequest, res) => {
    res.json(store.rides.filter((ride) => ride.driverId === req.user!.id));
  });

  router.post("/issues", requireAuth("driver"), (req: AuthRequest, res) => {
    const payload = issueSchema.parse(req.body);
    const complaint = {
      id: `cmp_${Date.now()}`,
      raisedByType: "driver" as const,
      raisedById: req.user!.id,
      resolutionStatus: "open" as const,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    store.complaints.unshift(complaint);
    return res.status(201).json(complaint);
  });

  return router;
}
