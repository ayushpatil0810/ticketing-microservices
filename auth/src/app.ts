import express from "express";
import authRouter from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./utils/app-error";

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRouter);

// 404 handler for unmatched routes
app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

// Central error handling middleware
app.use(errorHandler);

export default app;
