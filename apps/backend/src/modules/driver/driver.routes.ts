import { Router } from "express";
import { z } from "zod";

import { PlatformRepository } from "../../db/repository";
import { validateBody } from "../../lib/validation";
import { requireAuth, type AuthRequest } from "../common/auth";

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
  rideId: z.string().uuid(),
  complaintType: z.string().min(2),
  description: z.string().min(5),
});

export function buildDriverRouter(repository: PlatformRepository) {
  const router = Router();

  router.get("/profile", requireAuth("driver"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getDriverProfile(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/availability", requireAuth("driver"), validateBody(availabilitySchema), async (req: AuthRequest, res, next) => {
    try {
      res.json(
        await repository.updateDriverAvailability(req.user!.id, {
          isOnline: req.body.isOnline,
          latitude: req.body.location?.latitude,
          longitude: req.body.location?.longitude,
        })
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/requests", requireAuth("driver"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getDriverRequests(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.get("/earnings", requireAuth("driver"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getDriverEarnings(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.get("/history", requireAuth("driver"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getDriverHistory(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.get("/active-ride", requireAuth("driver"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getActiveDriverRide(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.post("/issues", requireAuth("driver"), validateBody(issueSchema), async (req: AuthRequest, res, next) => {
    try {
      const complaint = await repository.createComplaint({
        ...req.body,
        raisedByType: "driver",
        raisedById: req.user!.id,
      });
      res.status(201).json(complaint);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
