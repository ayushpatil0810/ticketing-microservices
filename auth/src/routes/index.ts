import express from "express";
import { signup } from "../controllers/signup.controller.js";
import asyncHandler from "../utils/async-handler.js";

const router = express.Router();

// ─── Auth routes (/api/auth/…) ───────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Create a new user account.
 */
router.post("/signup", signup);

/**
 * GET /api/auth/currentuser
 * Return the currently authenticated user (from session/JWT).
 * @todo Implement authentication middleware + JWT verification
 */
router.get(
  "/currentuser",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

/**
 * POST /api/auth/signin
 * Sign in with email + password.
 * @todo Implement signin controller
 */
router.post(
  "/signin",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

/**
 * POST /api/auth/signout
 * Invalidate the current session/token.
 * @todo Implement signout controller
 */
router.post(
  "/signout",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

router.get(
  "/test",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, message: "Auth route is working" });
  }),
);
export default router;
