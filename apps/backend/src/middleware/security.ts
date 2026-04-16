import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";

import { env } from "../config/env";

export function commonSecurityMiddleware() {
  const allowedOrigins = new Set(env.allowedWebOrigins);

  return [
    pinoHttp({
      redact: ["req.headers.authorization"],
    }),
    helmet(),
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
    }),
    compression(),
    express.json({ limit: "1mb" }),
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMaxRequests,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  ];
}

export function authRateLimiter() {
  return rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.authRateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
  });
}
