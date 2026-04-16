import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import type { Request } from "express";

import { env } from "../config/env";

function isLocalOrigin(origin: string) {
  return (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.startsWith("https://localhost:") ||
    origin.startsWith("https://127.0.0.1:")
  );
}

function isLocalRequest(req: Request) {
  const origin = req.get("origin");
  const host = req.get("host");
  const ip = req.ip ?? "";

  if (origin && isLocalOrigin(origin)) {
    return true;
  }

  if (host && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) {
    return true;
  }

  return ip === "::1" || ip === "127.0.0.1" || ip.endsWith("127.0.0.1");
}

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
      skip: (req) => !env.isProduction && isLocalRequest(req),
    }),
  ];
}

export function authRateLimiter() {
  return rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.authRateLimitMaxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => !env.isProduction && isLocalRequest(req),
  });
}
