import { Router } from "express";
import { z } from "zod";

import { requireAuth, type AuthRequest } from "modules/common/auth";
import { store } from "modules/common/store";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  emergencyContact: z.string().optional(),
  preferredPaymentMethod: z.enum(["cash", "upi"]).optional(),
});

const complaintSchema = z.object({
  rideId: z.string(),
  complaintType: z.string(),
  description: z.string().min(5),
});

export function buildCustomerRouter() {
  const router = Router();

  router.get("/profile", requireAuth("customer"), (req: AuthRequest, res) => {
    const customer = store.customers.find((item) => item.id === req.user!.id);
    res.json(customer);
  });

  router.put("/profile", requireAuth("customer"), (req: AuthRequest, res) => {
    const payload = profileSchema.parse(req.body);
    const customer = store.customers.find((item) => item.id === req.user!.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    Object.assign(customer, payload);
    return res.json(customer);
  });

  router.get("/landmarks", requireAuth("customer"), (_req, res) => {
    res.json(store.landmarks);
  });

  router.get("/rides/history", requireAuth("customer"), (req: AuthRequest, res) => {
    res.json(store.rides.filter((ride) => ride.customerId === req.user!.id));
  });

  router.post("/complaints", requireAuth("customer"), (req: AuthRequest, res) => {
    const payload = complaintSchema.parse(req.body);
    const complaint = {
      id: `cmp_${Date.now()}`,
      raisedByType: "customer" as const,
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
