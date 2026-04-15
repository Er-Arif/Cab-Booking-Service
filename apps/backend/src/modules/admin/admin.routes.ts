import { Router } from "express";
import { z } from "zod";

import { PlatformRepository } from "../../db/repository";
import { validateBody } from "../../lib/validation";
import { requireAuth } from "../common/auth";

const complaintResolutionSchema = z.object({
  resolutionStatus: z.enum(["open", "in_review", "resolved", "closed"]),
  resolutionNote: z.string().min(2),
});

const fareSchema = z.object({
  baseFare: z.number(),
  minimumFare: z.number(),
  perKmRate: z.number(),
  perMinuteRate: z.number(),
  waitingCharge: z.number(),
  cancellationFee: z.number(),
});

const driverStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "suspended"]),
});

export function buildAdminRouter(repository: PlatformRepository) {
  const router = Router();

  router.use(requireAuth("admin"));

  router.get("/dashboard", async (_req, res, next) => {
    try {
      res.json({ metrics: await repository.getDashboardMetrics() });
    } catch (error) {
      next(error);
    }
  });

  router.get("/drivers", async (_req, res, next) => {
    try {
      res.json(await repository.listDrivers());
    } catch (error) {
      next(error);
    }
  });

  router.get("/customers", async (_req, res, next) => {
    try {
      res.json(await repository.listCustomers());
    } catch (error) {
      next(error);
    }
  });

  router.get("/rides", async (_req, res, next) => {
    try {
      res.json(await repository.listRides());
    } catch (error) {
      next(error);
    }
  });

  router.get("/complaints", async (_req, res, next) => {
    try {
      res.json(await repository.listComplaints());
    } catch (error) {
      next(error);
    }
  });

  router.get("/landmarks", async (_req, res, next) => {
    try {
      res.json(await repository.getLandmarks());
    } catch (error) {
      next(error);
    }
  });

  router.get("/zones", async (_req, res, next) => {
    try {
      res.json(await repository.listZones());
    } catch (error) {
      next(error);
    }
  });

  router.get("/categories", async (_req, res, next) => {
    try {
      res.json(await repository.listRideCategories());
    } catch (error) {
      next(error);
    }
  });

  router.patch("/drivers/:driverId/status", validateBody(driverStatusSchema), async (req, res, next) => {
    try {
      res.json(await repository.updateDriverStatus(String(req.params.driverId), req.body.status));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/categories/:categoryId", validateBody(fareSchema), async (req, res, next) => {
    try {
      res.json(await repository.updateCategory(String(req.params.categoryId), req.body));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/complaints/:complaintId", validateBody(complaintResolutionSchema), async (req, res, next) => {
    try {
      res.json(await repository.resolveComplaint(String(req.params.complaintId), req.body));
    } catch (error) {
      next(error);
    }
  });

  router.get("/reports/summary", async (_req, res, next) => {
    try {
      res.json(await repository.getSummaryReport());
    } catch (error) {
      next(error);
    }
  });

  return router;
}
