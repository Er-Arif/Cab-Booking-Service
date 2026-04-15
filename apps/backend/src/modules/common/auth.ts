import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    role: "customer" | "driver" | "admin";
  };
}

export function signJwt(payload: { id: string; phone: string; role: "customer" | "driver" | "admin" }) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function requireAuth(role?: "customer" | "driver" | "admin") {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing bearer token" });
    }

    try {
      const decoded = jwt.verify(header.slice(7), env.jwtSecret) as AuthRequest["user"];
      if (role && decoded?.role !== role) {
        return res.status(403).json({ message: "Forbidden for this role" });
      }
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token", error });
    }
  };
}
