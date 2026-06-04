import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let server: ReturnType<typeof app.listen>;

const start = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable must be defined");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable must be defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("[auth] Connected to MongoDB");

    server = app.listen(PORT, () => {
      console.log(`[auth] Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("[auth] Failed to start application:", err);
    process.exit(1);
  }
};

void start();

// ─── Graceful shutdown ────────────────────────────────────────────────────────

const shutdown = async (signal: string): Promise<void> => {
  console.log(`[auth] Received ${signal}. Shutting down gracefully…`);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log("[auth] HTTP server closed.");
          resolve();
        });
      });
    }

    await mongoose.connection.close();
    console.log("[auth] MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("[auth] Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
