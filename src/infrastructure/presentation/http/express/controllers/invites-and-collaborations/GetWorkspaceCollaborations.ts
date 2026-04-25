import { GetWorkspaceCollaborationsUseCase } from "@use-cases/invites-and-collaborations/GetWorkspaceCollaborations";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetWorkspaceCollaborationsController {
  constructor(private readonly useCase: GetWorkspaceCollaborationsUseCase) {}

  async handle(request: Request, response: Response) {
    const collaborators = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
      },
    });

    response.status(200).json(collaborators);
  }
}
