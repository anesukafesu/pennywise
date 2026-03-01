import { DeleteBudgetUseCase } from "@use-cases/budgets/DeleteBudget";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeleteBudgetController {
  constructor(private readonly useCase: DeleteBudgetUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
      details: {
        budgetId: request.body.budgetId as UUID,
      },
    });

    response.status(204).json(response);
  }
}
