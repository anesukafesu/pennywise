import { UpdateWorkspaceUseCase } from "@use-cases/workspaces/UpdateWorkspace";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class UpdateWorkspaceController {
  constructor(private readonly useCase: UpdateWorkspaceUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedWorkspace = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        name: request.body.name,
        description: request.body.description,
        currencyCode: request.body.currencyCode,
      },
    });

    response.status(200).json(updatedWorkspace);
  }
}
