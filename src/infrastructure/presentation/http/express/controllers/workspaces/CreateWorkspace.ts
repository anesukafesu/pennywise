import { CreateWorkspaceUseCase } from "@use-cases/workspaces/CreateWorkspace";
import { Request, Response } from "express";

export class CreateWorkspaceController {
  constructor(private readonly useCase: CreateWorkspaceUseCase) {}

  async handle(request: Request, response: Response) {
    const workspace = await this.useCase.execute({
      actor: request.actor,
      details: {
        name: request.body.name,
        description: request.body.description,
        currencyCode: request.body.currencyCode,
      },
    });

    response.status(201).json(workspace);
  }
}
