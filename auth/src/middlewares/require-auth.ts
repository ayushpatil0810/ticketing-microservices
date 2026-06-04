import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { UnauthorizedError } from "../utils/app-error.js";
import { User } from "../models/user.js";

/** Expected shape of the JWT payload issued by signup/signin. */
interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Express middleware that verifies the JWT stored in the `token` cookie.
 *
 * On success, attaches the authenticated Mongoose user document to `req.currentUser`
 * and calls `next()`.
 *
 * On failure (missing cookie, invalid token, or user no longer exists),
 * throws `UnauthorizedError` which is caught by the central error handler.
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  // ── Extract JWT from the HTTP-only cookie ────────────────────────────────
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }

  // ── Verify the token and decode the payload ──────────────────────────────
  let payload: JwtPayload;
  try {
    payload = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
  } catch (err) {
    // Any verification failure (expired, tampered, bad signature) → 401
    throw new UnauthorizedError("Invalid or expired token");
  }

  // ── Load the user from the database ──────────────────────────────────────
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  // ── Attach user to request and proceed ───────────────────────────────────
  req.currentUser = user;
  next();
};
