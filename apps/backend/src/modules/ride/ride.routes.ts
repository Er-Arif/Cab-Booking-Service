import { Router } from "express";
import { z } from "zod";

import { requireAuth, type AuthRequest } from "modules/common/auth";

import { RideService } from "./ride.service";

const createBookingSchema = z.object({
  categoryKey: z.enum(["bike", "e_rickshaw"]),
  pickupAddress: z.string().min(2),
  dropAddress: z.string().min(2),
  pickupNote: z.string().optional(),
  dropNote: z.string().optional(),
  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  drop: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  paymentMethod: z.enum(["cash", "upi"]),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "driver_arriving",
    "driver_arrived",
    "trip_started",
    "trip_completed",
    "cancelled_by_user",
    "cancelled_by_driver",
    "cancelled_by_admin",
  ]),
});

export function buildRideRouter(rideService: RideService) {
  const router = Router();

  router.get("/", requireAuth(), (_req, res) => {
    res.json(rideService.listRides());
  });

  router.post("/", requireAuth("customer"), async (req: AuthRequest, res) => {
    try {
      const payload = createBookingSchema.parse(req.body);
      const response = await rideService.createBooking({
        customerId: req.user!.id,
        ...payload,
      });
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: "Unable to create booking", error });
    }
  });

  router.patch("/:rideId/status", requireAuth(), (req, res) => {
    try {
      const payload = updateStatusSchema.parse(req.body);
      const ride = rideService.updateRideStatus(String(req.params.rideId), payload.status);
      res.json(ride);
    } catch (error) {
      res.status(400).json({ message: "Unable to update status", error });
    }
  });

  router.patch("/:rideId/payment", requireAuth(), (req, res) => {
    try {
      const result = rideService.markPaymentComplete(String(req.params.rideId));
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Unable to record payment", error });
    }
  });

  return router;
}
