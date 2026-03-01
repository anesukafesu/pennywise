import { ListWorkspaceBudgetsUseCase } from "@use-cases/budgets/ListWorkspaceBudgets";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class ListWorkspaceBudgetsController {
  constructor(private readonly useCase: ListWorkspaceBudgetsUseCase) {}

  async handle(request: Request, response: Response) {
    const budgets = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
      },
    });

    response.status(200).json(budgets);
  }
}
