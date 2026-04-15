import { Router } from "express";
import { z } from "zod";

import { validateBody } from "../../lib/validation";
import { authRateLimiter } from "../../middleware/security";

import { AuthService } from "./auth.service";

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  role: z.enum(["customer", "driver", "admin"]),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().min(4).max(6),
  role: z.enum(["customer", "driver", "admin"]),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export function buildAuthRouter(authService: AuthService) {
  const router = Router();

  router.use(authRateLimiter());

  router.post("/send-otp", validateBody(sendOtpSchema), async (req, res, next) => {
    try {
      const payload = req.body as z.infer<typeof sendOtpSchema>;
      const response = await authService.sendOtp(payload.phone, payload.role);
      res.json({ message: "OTP sent", ...response });
    } catch (error) {
      next(error);
    }
  });

  router.post("/verify-otp", validateBody(verifyOtpSchema), async (req, res, next) => {
    try {
      const payload = req.body as z.infer<typeof verifyOtpSchema>;
      const response = await authService.verifyOtp(payload.phone, payload.otp, payload.role);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/refresh", validateBody(refreshSchema), async (req, res, next) => {
    try {
      const payload = req.body as z.infer<typeof refreshSchema>;
      res.json(await authService.refreshSession(payload.refreshToken));
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", validateBody(refreshSchema), async (req, res, next) => {
    try {
      const payload = req.body as z.infer<typeof refreshSchema>;
      res.json(await authService.logout(payload.refreshToken));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
