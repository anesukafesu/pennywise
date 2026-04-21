import { Expired } from "@application/errors/Expired";
import { Forbidden } from "@application/errors/Forbidden";
import { NotFound } from "@application/errors/NotFound";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { Unauthenticated } from "@application/errors/Unauthenticated";
import { InvalidInput as DomainInvalidInput } from "@domain/errors/InvalidInput";
import { Request, Response, RequestHandler } from "express";

type Controller = {
  handle(req: Request, res: Response): Promise<void>;
};

export function adaptController(controller: Controller): RequestHandler {
  return async (req, res) => {
    try {
      await controller.handle(req, res);
    } catch (error) {
      handleError(error, res);
    }
  };
}

function handleError(error: unknown, res: Response) {
  if (error instanceof DomainInvalidInput) {
    return res.status(400).json({
      error: error.message,
    });
  }

  if (error instanceof Unauthenticated) {
    return res.status(401).json({
      error: error.message,
    });
  }

  if (error instanceof Forbidden) {
    return res.status(403).json({
      error: error.message,
    });
  }

  if (error instanceof NotFound) {
    return res.status(404).json({
      error: error.message,
    });
  }

  if (error instanceof ResourceConflict) {
    return res.status(409).json({
      error: error.message || "Resource conflict.",
    });
  }

  if (error instanceof Expired) {
    return res.status(410).json({
      error: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Internal server error",
  });
}
