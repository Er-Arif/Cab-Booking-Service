import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { AuthenticationError, AuthorizationError } from "../../lib/errors";

export interface AuthenticatedUser {
  id: string;
  phone: string;
  role: "customer" | "driver" | "admin";
  tokenType: "access" | "refresh";
  sessionId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function signAccessToken(payload: { id: string; phone: string; role: "customer" | "driver" | "admin" }) {
  return jwt.sign(
    { ...payload, tokenType: "access" },
    env.jwtSecret,
    {
      expiresIn: `${env.accessTokenTtlMinutes}m`,
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
}

export function signRefreshToken(payload: {
  id: string;
  phone: string;
  role: "customer" | "driver" | "admin";
  sessionId: string;
}) {
  return jwt.sign(
    { ...payload, tokenType: "refresh" },
    env.jwtSecret,
    {
      expiresIn: `${env.refreshTokenTtlDays}d`,
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret, {
    issuer: env.jwtIssuer,
    audience: env.jwtAudience,
  }) as AuthenticatedUser;
}

export function requireAuth(role?: "customer" | "driver" | "admin") {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(new AuthenticationError("Missing bearer token"));
    }

    try {
      const decoded = verifyToken(header.slice(7));
      if (decoded.tokenType !== "access") {
        return next(new AuthenticationError("Access token required"));
      }
      if (role && decoded.role !== role) {
        return next(new AuthorizationError());
      }

      req.user = decoded;
      return next();
    } catch (_error) {
      return next(new AuthenticationError("Invalid or expired token"));
    }
  };
}
