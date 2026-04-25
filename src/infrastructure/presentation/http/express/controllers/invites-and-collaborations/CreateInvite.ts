import { CreateInviteUseCase } from "@use-cases/invites-and-collaborations/CreateInvite";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class CreateInviteController {
  constructor(private readonly useCase: CreateInviteUseCase) {}

  async handle(request: Request, response: Response) {
    const invite = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        email: request.body.email,
      },
    });

    response.status(201).json(invite);
  }
}
