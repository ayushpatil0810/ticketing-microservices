import type { Request, Response, NextFunction } from "express";
import { apiResponse } from "../utils/response.js";
import asyncHandler from "../utils/async-handler.js";

/**
 * POST /api/auth/signout
 *
 * Clears the JWT cookie, effectively signing the user out.
 *
 * Returns: 200 success message.
 */
export const signout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // Clear the token cookie by setting an expired date.
    // Use the same options (httpOnly, secure, sameSite) as when it was set
    // so the browser correctly identifies which cookie to remove.
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    apiResponse(res, true, "Signed out successfully");
  },
);
