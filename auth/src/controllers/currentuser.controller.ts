import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/response.js";
import { UnauthorizedError } from "../utils/app-error.js";
import asyncHandler from "../utils/async-handler.js";

/**
 * GET /api/auth/currentuser
 *
 * Returns the currently authenticated user.
 *
 * Expects `req.currentUser` to be populated by the `requireAuth` middleware.
 * The user object's `toJSON` transform strips the passwordHash automatically.
 *
 * Returns: 200 with the user object.
 */
export const currentuser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    if (!req.currentUser) {
      throw new UnauthorizedError("Not authenticated");
    }

    apiResponse(
      res,
      true,
      "Current user retrieved",
      req.currentUser.toJSON(),
    );
  },
);
