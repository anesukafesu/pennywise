import { Request, Response } from "express";

export class SignOutController {
  async handle(request: Request, response: Response) {
    request.session.destroy((error) => {
      if (error) {
        response.status(500).json({ error: "Unable to sign out" });
        return;
      }

      response.clearCookie("pennywise.sid");
      response.status(204).end();
    });
  }
}
