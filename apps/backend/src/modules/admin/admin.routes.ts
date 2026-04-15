import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "modules/common/auth";
import { store } from "modules/common/store";

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

export function buildAdminRouter() {
  const router = Router();

  router.use(requireAuth("admin"));

  router.get("/dashboard", (_req, res) =>
    res.json({
      metrics: {
        totalRidesToday: store.rides.length,
        completedRides: store.rides.filter((ride) => ride.status === "payment_completed").length,
        cancelledRides: store.rides.filter((ride) => ride.status.startsWith("cancelled")).length,
        activeDrivers: store.drivers.filter((driver) => driver.isOnline).length,
        activeCustomers: store.customers.length,
        grossRevenue: store.rides.reduce((sum, ride) => sum + (ride.finalFare ?? ride.estimatedFare), 0),
        platformCommission: store.rides.reduce(
          (sum, ride) => sum + (ride.finalFare ?? ride.estimatedFare) * 0.15,
          0
        ),
        topRoutes: ["Railway Station -> Main Market", "Bus Stand -> Hospital Area"],
        peakBookingHours: ["08:00-10:00", "17:00-20:00"],
      },
    })
  );

  router.get("/drivers", (_req, res) => res.json(store.drivers));
  router.get("/customers", (_req, res) => res.json(store.customers));
  router.get("/rides", (_req, res) => res.json(store.rides));
  router.get("/complaints", (_req, res) => res.json(store.complaints));
  router.get("/landmarks", (_req, res) => res.json(store.landmarks));
  router.get("/zones", (_req, res) => res.json(store.serviceZones));
  router.get("/categories", (_req, res) => res.json(store.rideCategories));

  router.patch("/drivers/:driverId/status", (req, res) => {
    const status = z.enum(["pending", "approved", "rejected", "suspended"]).parse(req.body.status);
    const driver = store.drivers.find((item) => item.id === req.params.driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    driver.status = status;
    return res.json(driver);
  });

  router.patch("/categories/:categoryId", (req, res) => {
    const payload = fareSchema.parse(req.body);
    const category = store.rideCategories.find((item) => item.id === req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    Object.assign(category, payload);
    return res.json(category);
  });

  router.patch("/complaints/:complaintId", (req, res) => {
    const payload = complaintResolutionSchema.parse(req.body);
    const complaint = store.complaints.find((item) => item.id === req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.resolutionStatus = payload.resolutionStatus;
    complaint.resolutionNote = payload.resolutionNote;
    complaint.resolvedAt = payload.resolutionStatus === "resolved" ? new Date().toISOString() : complaint.resolvedAt;
    return res.json(complaint);
  });

  router.get("/reports/summary", (_req, res) => {
    const completed = store.rides.filter((ride) => ride.paymentStatus === "completed");
    res.json({
      ridesPerCategory: store.rideCategories.map((category) => ({
        category: category.label,
        rideCount: completed.filter((ride) => ride.categoryKey === category.key).length,
      })),
      paymentMix: {
        cash: completed.filter((ride) => ride.paymentMethod === "cash").length,
        upi: completed.filter((ride) => ride.paymentMethod === "upi").length,
      },
      complaintOpenCount: store.complaints.filter((complaint) => complaint.resolutionStatus !== "resolved").length,
    });
  });

  return router;
}
