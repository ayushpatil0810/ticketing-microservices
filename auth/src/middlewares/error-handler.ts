import type { Request, Response, NextFunction } from "express";
import { AppError, RequestError } from "../utils/app-error";

/**
 * Central Express error-handling middleware.
 *
 * Convention: any controller/middleware should either call next(err) or
 * throw inside an asyncHandler wrapper — never call res.json() for errors.
 *
 * Shape returned to the client:
 *   { success: false, message: string, errors?: unknown }
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof RequestError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ?? null,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected Errors, logged for debugging, but not exposed to clients

  console.error("[Unhandled Error]", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
