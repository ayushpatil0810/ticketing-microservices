import type { Request, Response, NextFunction } from "express";
import { signupRequestSchema } from "../validations/index.js";
import { apiResponse } from "../utils/response.js";
import { RequestError } from "../utils/app-error.js";
import asyncHandler from "../utils/async-handler.js";
import { User } from "../models/user.js";

/**
 * POST /api/auth/signup
 *
 * Creates a new user account.
 *
 * Body: { username, email, password }
 * Returns: 201 with the created user (passwordHash stripped by model toJSON)
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const result = signupRequestSchema.safeParse(req.body);

    if (!result.success) {
      throw new RequestError("Validation failed", result.error.flatten());
    }

    const { username, email, password } = result.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      throw new RequestError(`That ${field} is already taken`);
    }

    const user = User.build({ username, email, password });
    await user.save();

    apiResponse(res, true, "Account created successfully", user.toJSON(), 201);
  },
);
