import { GetWorkspaceInvitesUseCase } from "@use-cases/invites-and-collaborations/GetWorkspaceInvites.usecase";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetWorkspaceInvitesController {
  constructor(private readonly useCase: GetWorkspaceInvitesUseCase) {}

  async handle(request: Request, response: Response) {
    const invites = await this.useCase.execute({
      actor: request.actor,
      data: {
        workspaceId: request.params.workspaceId as UUID,
      },
    });

    response.status(200).json(invites);
  }
}
