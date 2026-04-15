import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

import { ValidationError } from "./errors";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError("Request body validation failed", result.error.flatten()));
    }
    req.body = result.data;
    return next();
  };
}
