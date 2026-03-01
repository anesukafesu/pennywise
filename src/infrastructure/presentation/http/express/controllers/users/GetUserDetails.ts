import { GetUserDetailsUseCase } from "@use-cases/users/GetUserDetails";
import { Request, Response } from "express";

export class GetUserDetailsController {
  constructor(private readonly useCase: GetUserDetailsUseCase) {}

  async handle(request: Request, response: Response) {
    const userDetails = await this.useCase.execute({
      actor: request.actor,
    });

    response.status(200).json(userDetails);
  }
}
