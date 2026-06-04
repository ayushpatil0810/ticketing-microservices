import express from "express";
import authRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { NotFoundError } from "./utils/app-error.js";

const app = express();

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
