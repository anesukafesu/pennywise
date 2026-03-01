import { Actor } from "@domain/actors/Actor";

declare global {
  namespace Express {
    interface Request {
      actor?: Actor;
    }
  }
}

export {};
