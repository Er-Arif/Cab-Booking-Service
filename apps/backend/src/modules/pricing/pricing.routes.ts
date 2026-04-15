import { Router } from "express";
import { z } from "zod";

import { validateBody } from "../../lib/validation";

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

  router.post("/estimate", validateBody(estimateFareSchema), async (req, res, next) => {
    try {
      const result = await pricingService.estimateFare(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
