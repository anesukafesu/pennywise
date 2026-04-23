import { createAppRouter } from "@infrastructure/presentation/http/express/composition/router";
import { createSessionMiddleware } from "@infrastructure/presentation/http/express/composition/session";
import express from "express";
import cors from "cors";

export function createServer(
  router: ReturnType<typeof createAppRouter>,
  sessionMiddleware: Awaited<ReturnType<typeof createSessionMiddleware>>,
) {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: true
  }));
  
  app.use(express.json());
  app.use(sessionMiddleware);
  app.use(router);
  return app;
}
