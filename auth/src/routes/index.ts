import express from "express";
import { signup } from "../controllers/signup.controller.js";
import { signin } from "../controllers/signin.controller.js";
import { signout } from "../controllers/signout.controller.js";
import { currentuser } from "../controllers/currentuser.controller.js";
import { requireAuth } from "../middlewares/require-auth.js";
import asyncHandler from "../utils/async-handler.js";

const router = express.Router();

// ─── Auth routes (/api/auth/…) ───────────────────────────────────────────────

/**
 * POST /api/auth/signup
 *
 * Create a new user account.
 * Body: { username, email, password }
 */
router.post("/signup", signup);

/**
 * POST /api/auth/signin
 *
 * Authenticate an existing user.
 * Body: { email, password }
 */
router.post("/signin", signin);

/**
 * POST /api/auth/signout
 *
 * Clear the JWT cookie and sign the user out.
 */
router.post("/signout", signout);

/**
 * GET /api/auth/currentuser
 *
 * Return the currently authenticated user.
 * Protected by requireAuth middleware.
 */
router.get("/currentuser", requireAuth, currentuser);

/**
 * GET /api/auth/test
 *
 * Simple smoke-test endpoint to verify the auth router is mounted.
 */
router.get(
  "/test",
  asyncHandler(async (_req, res) => {
    res.json({ success: true, message: "Auth route is working" });
  }),
);

export default router;
