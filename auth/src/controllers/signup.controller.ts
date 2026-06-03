import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { signupRequestSchema } from "../validations";
import { apiResponse } from "../utils/response";
import { RequestError } from "../utils/app-error";
import asyncHandler from "../utils/async-handler";

export const signup = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const result = signupRequestSchema.safeParse(req.body);

    if (!result.success) {
      throw new RequestError("Validation failed", z.treeifyError(result.error));
    }

    // TODO: hash password, persist user, issue token
    const { username, email } = result.data;
    void username;
    void email;

    apiResponse(res, true, "User registered successfully", null, 201);
  },
);
