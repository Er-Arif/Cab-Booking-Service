import { Router } from "express";
import { z } from "zod";

import { AuthService } from "./auth.service";

const sendOtpSchema = z.object({
  phone: z.string().min(10),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().min(4),
  role: z.enum(["customer", "driver", "admin"]),
});

export function buildAuthRouter(authService: AuthService) {
  const router = Router();

  router.post("/send-otp", async (req, res) => {
    const payload = sendOtpSchema.parse(req.body);
    const response = await authService.sendOtp(payload.phone);
    res.json({ message: "OTP sent", ...response });
  });

  router.post("/verify-otp", async (req, res) => {
    try {
      const payload = verifyOtpSchema.parse(req.body);
      const response = await authService.verifyOtp(payload.phone, payload.otp, payload.role);
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: "OTP verification failed", error });
    }
  });

  return router;
}
