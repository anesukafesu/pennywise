import { DeleteUserUseCase } from "@use-cases/users/DeleteUser";
import { Request, Response } from "express";
import { promisify } from "node:util";

export class DeleteUserController {
  constructor(private readonly useCase: DeleteUserUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
    });

    const destroySession = promisify(request.session.destroy).bind(
      request.session,
    );

    await destroySession();

    // TODO: Find a cleaner way
    response.clearCookie("connect.sid");
    response.status(204).end();
  }
}
