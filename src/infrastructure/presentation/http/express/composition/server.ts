import { createAppRouter } from "@infrastructure/presentation/http/express/composition/router";
import { createSessionMiddleware } from "@infrastructure/presentation/http/express/composition/session";
import express from "express";

export function createServer(
  router: ReturnType<typeof createAppRouter>,
  sessionMiddleware: Awaited<ReturnType<typeof createSessionMiddleware>>,
) {
  const app = express();
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use(router);
  return app;
}
