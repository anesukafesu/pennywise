import { loadActorFromSession } from "@infrastructure/presentation/http/express/session/actorSession";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const actor = loadActorFromSession(req);

  if (!actor) {
    res.status(401).send({ error: `${req.path} requires authentication.` });
  }

  req.actor = actor;
  next();
}
