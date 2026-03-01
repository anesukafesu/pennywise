import { ListWorkspacesForActorUseCase } from "@use-cases/workspaces/ListWorkspacesForActor";
import { Request, Response } from "express";

export class ListWorkspacesForActorController {
  constructor(private readonly useCase: ListWorkspacesForActorUseCase) {}

  async handle(request: Request, response: Response) {
    const workspaces = await this.useCase.execute({
      actor: request.actor,
    });

    response.status(200).json(workspaces);
  }
}
