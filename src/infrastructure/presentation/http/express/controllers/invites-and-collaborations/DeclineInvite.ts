import { DeclineInviteUseCase } from "@use-cases/invites-and-collaborations/DeclineInvite";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeclineInviteController {
  constructor(private readonly useCase: DeclineInviteUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
      details: {
        inviteId: request.params.inviteId as UUID,
      },
    });

    response.status(204).end();
  }
}
