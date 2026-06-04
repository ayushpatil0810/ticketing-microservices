import express from "express";
import authRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { NotFoundError } from "./utils/app-error.js";
import cookieParser from "cookie-parser";

const app = express();

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ─── Cookie parsing ───────────────────────────────────────────────────────────
app.use(cookieParser());
// ─── Health check ─────────────────────────────────────────────────────────────
// Used by Kubernetes liveness and readiness probes.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
// Mount at /api/auth so requests to ticketing.dev/api/auth/signup are handled
app.use("/api/auth", authRouter);

// ─── 404 catch-all ───────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

// ─── Central error handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
