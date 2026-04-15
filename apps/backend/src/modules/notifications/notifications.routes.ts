import { Router } from "express";
import { z } from "zod";

import type { PushNotificationProvider } from "domain/providers/types";
import { requireAuth } from "modules/common/auth";

export function buildNotificationsRouter(pushProvider: PushNotificationProvider) {
  const router = Router();
  const schema = z.object({
    targetId: z.string(),
    title: z.string(),
    message: z.string(),
  });

  router.post("/", requireAuth("admin"), async (req, res) => {
    const payload = schema.parse(req.body);
    await pushProvider.sendNotification(payload.targetId, payload.title, payload.message);
    res.status(201).json({ success: true });
  });

  return router;
}
