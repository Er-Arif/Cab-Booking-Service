import { Router } from "express";
import { z } from "zod";

import { PricingService } from "./pricing.service";

const estimateFareSchema = z.object({
  pickup: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  drop: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  categoryKey: z.enum(["bike", "e_rickshaw"]),
});

export function buildPricingRouter(pricingService: PricingService) {
  const router = Router();

  router.post("/estimate", async (req, res) => {
    try {
      const payload = estimateFareSchema.parse(req.body);
      const result = await pricingService.estimateFare(payload);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Unable to estimate fare", error });
    }
  });

  return router;
}
