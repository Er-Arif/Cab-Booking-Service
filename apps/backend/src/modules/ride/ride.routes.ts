import { Router } from "express";
import { z } from "zod";

import { validateBody } from "../../lib/validation";
import { requireAuth, type AuthRequest } from "../common/auth";

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

  router.get("/", requireAuth(), async (_req, res, next) => {
    try {
      res.json(await rideService.listRides());
    } catch (error) {
      next(error);
    }
  });

  router.post("/", requireAuth("customer"), validateBody(createBookingSchema), async (req: AuthRequest, res, next) => {
    try {
      const response = await rideService.createBooking({
        customerId: req.user!.id,
        ...req.body,
      });
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:rideId/status", requireAuth(), validateBody(updateStatusSchema), async (req, res, next) => {
    try {
      const ride = await rideService.updateRideStatus(String(req.params.rideId), req.body.status);
      res.json(ride);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:rideId/payment", requireAuth(), async (req, res, next) => {
    try {
      res.json(await rideService.markPaymentComplete(String(req.params.rideId)));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
