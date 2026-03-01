import { GetWorkspaceUseCase } from "@use-cases/workspaces/GetWorkspace";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetWorkspaceController {
  constructor(private readonly useCase: GetWorkspaceUseCase) {}

  async handle(request: Request, response: Response) {
    const workspace = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
      },
    });

    response.status(200).json(workspace);
  }
}
