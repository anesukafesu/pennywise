import { TransferWorkspaceOwnershipUseCase } from "@use-cases/invites-and-collaborations/TransferWorkspaceOwnership";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class TransferWorkspaceOwnershipController {
  constructor(private readonly useCase: TransferWorkspaceOwnershipUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        successorId: request.body.successorId as UUID,
      },
    });

    response.status(204).end();
  }
}
