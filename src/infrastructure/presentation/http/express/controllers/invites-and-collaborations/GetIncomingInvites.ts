import { GetIncomingInvitesUseCase } from "@use-cases/invites-and-collaborations/GetIncomingInvites";
import { Request, Response } from "express";

export class GetIncomingInvitesController {
  constructor(private readonly useCase: GetIncomingInvitesUseCase) {}

  async handle(request: Request, response: Response) {
    const invites = await this.useCase.execute({
      actor: request.actor,
    });

    response.status(200).json(invites);
  }
}
