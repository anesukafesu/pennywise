import { Actor } from "@domain/entities/Actor";
import { Request } from "express";

export function storeActorInSession(req: Request, actor: Actor) {
  req.session.actor = { type: actor.type, id: actor.id };
}

export function loadActorFromSession(req: Request): Actor | undefined {
  if (!req.session.actor) return undefined;
  return new Actor(req.session.actor.type, req.session.actor.id);
}
