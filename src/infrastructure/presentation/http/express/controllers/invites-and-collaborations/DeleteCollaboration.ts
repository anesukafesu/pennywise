import { DeleteCollaborationUseCase } from "@use-cases/invites-and-collaborations/DeleteCollaboration";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeleteCollaborationController {
  constructor(private readonly useCase: DeleteCollaborationUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
      details: {
        collaborationId: request.params.collaborationId as UUID,
      },
    });

    response.status(204).end();
  }
}
