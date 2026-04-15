import { Router } from "express";
import { z } from "zod";

import type { PushNotificationProvider } from "../../domain/providers/types";
import { validateBody } from "../../lib/validation";
import { requireAuth } from "../common/auth";

export function buildNotificationsRouter(pushProvider: PushNotificationProvider) {
  const router = Router();
  const schema = z.object({
    targetId: z.string(),
    title: z.string(),
    message: z.string(),
  });

  router.post("/", requireAuth("admin"), validateBody(schema), async (req, res, next) => {
    try {
      const payload = schema.parse(req.body);
      await pushProvider.sendNotification(payload.targetId, payload.title, payload.message);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
