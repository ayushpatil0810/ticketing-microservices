import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = app.listen(PORT, () => {
  console.log(`[auth] Listening on port ${PORT}`);
});

// Graceful shutdown: allow in-flight requests to finish before exiting
const shutdown = (signal: string) => {
  console.log(`[auth] Received ${signal}. Shutting down gracefully…`);
  server.close(() => {
    console.log("[auth] HTTP server closed. Exiting.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
