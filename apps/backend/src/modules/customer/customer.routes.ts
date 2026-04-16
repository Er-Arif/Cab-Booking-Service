import { Router } from "express";
import { z } from "zod";

import { PlatformRepository } from "../../db/repository";
import { validateBody } from "../../lib/validation";
import { requireAuth, type AuthRequest } from "../common/auth";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  emergencyContact: z.string().optional(),
  preferredPaymentMethod: z.enum(["cash", "upi"]).optional(),
});

const complaintSchema = z.object({
  rideId: z.string().uuid(),
  complaintType: z.string().min(2),
  description: z.string().min(5),
});

export function buildCustomerRouter(repository: PlatformRepository) {
  const router = Router();

  router.get("/profile", requireAuth("customer"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getCustomerProfile(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.put("/profile", requireAuth("customer"), validateBody(profileSchema), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.updateCustomerProfile(req.user!.id, req.body));
    } catch (error) {
      next(error);
    }
  });

  router.get("/landmarks", requireAuth("customer"), async (_req, res, next) => {
    try {
      res.json(await repository.getLandmarks());
    } catch (error) {
      next(error);
    }
  });

  router.get("/rides/history", requireAuth("customer"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getCustomerRideHistory(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.get("/active-ride", requireAuth("customer"), async (req: AuthRequest, res, next) => {
    try {
      res.json(await repository.getActiveCustomerRide(req.user!.id));
    } catch (error) {
      next(error);
    }
  });

  router.post("/complaints", requireAuth("customer"), validateBody(complaintSchema), async (req: AuthRequest, res, next) => {
    try {
      const complaint = await repository.createComplaint({
        ...req.body,
        raisedByType: "customer",
        raisedById: req.user!.id,
      });
      res.status(201).json(complaint);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
