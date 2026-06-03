import express from "express";
import { signup } from "../controllers/signup.controller";
import asyncHandler from "../utils/async-handler";

const router = express.Router();

router.post("/signup", signup);


router.get(
  "/currentuser",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

router.post(
  "/signin",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

router.post(
  "/signout",
  asyncHandler(async (_req, res) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  }),
);

export default router;
