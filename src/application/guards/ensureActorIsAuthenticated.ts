import { Unauthenticated } from "@application/errors/Unauthenticated";
import { Actor } from "@entities/Actor";

export function ensureActorIsAuthenticated(actor: Actor) {
  if (actor.type !== "user" || !actor.id) {
    throw new Unauthenticated();
  }
}
