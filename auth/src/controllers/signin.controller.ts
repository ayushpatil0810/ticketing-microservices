import type { Request, Response, NextFunction } from "express";
import { signinRequestSchema } from "../validations/index.js";
import { apiResponse } from "../utils/response.js";
import { RequestError, UnauthorizedError } from "../utils/app-error.js";
import asyncHandler from "../utils/async-handler.js";
import { User } from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";

/** Cookie max-age in milliseconds (1 hour). */
const COOKIE_MAX_AGE_MS = 60 * 60 * 1000;

/**
 * POST /api/auth/signin
 *
 * Authenticates an existing user with email and password.
 *
 * Body: { email, password }
 * Returns: 200 with the user object and sets an HTTP-only JWT cookie.
 */
export const signin = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // ── Validate request body ──────────────────────────────────────────────
    const result = signinRequestSchema.safeParse(req.body);

    if (!result.success) {
      throw new RequestError("Validation failed", result.error.flatten());
    }

    const { email, password } = result.data;

    // ── Lookup user by email ───────────────────────────────────────────────
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // ── Verify password ────────────────────────────────────────────────────
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // ── Issue JWT and set HTTP-only cookie ─────────────────────────────────
    const token = jsonwebtoken.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE_MS,
    });

    apiResponse(
      res,
      true,
      "Signed in successfully",
      { ...user.toJSON(), token },
      200,
    );
  },
);
