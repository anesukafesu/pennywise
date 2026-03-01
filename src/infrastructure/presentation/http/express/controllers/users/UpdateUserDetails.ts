import { UpdateUserDetailsUseCase } from "@use-cases/users/UpdateUserDetails";
import { Request, Response } from "express";

export class UpdateUserDetailsController {
  constructor(private readonly useCase: UpdateUserDetailsUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedUser = await this.useCase.execute({
      actor: request.actor,
      details: {
        name: request.body.name,
        avatarUrl: request.body.avatarUrl,
      },
    });

    response.status(200).json(updatedUser);
  }
}
