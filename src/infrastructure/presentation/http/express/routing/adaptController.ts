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
  // TODO: Translate application/domain errors to http error codes and messages
  console.error(error);
  return res.status(500).json({
    error: "Internal server error",
  });
}
