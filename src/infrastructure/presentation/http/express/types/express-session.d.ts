import "express-session";
import { Actor } from "@entities/Actor";

declare module "express-session" {
  interface SessionData {
    actor: Actor;
  }
}
