import { ListWorkspaceCategoriesUseCase } from "@use-cases/categories/ListWorkspaceCategories";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class ListWorkspaceCategoriesController {
  constructor(private readonly useCase: ListWorkspaceCategoriesUseCase) {}

  async handle(request: Request, response: Response) {
    const categories = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
      },
    });

    response.status(200).json(categories);
  }
}
