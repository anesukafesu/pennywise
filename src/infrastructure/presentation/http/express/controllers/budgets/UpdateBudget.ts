import { UpdateBudgetUseCase } from "@use-cases/budgets/UpdateBudget";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class UpdateBudgetController {
  constructor(private readonly useCase: UpdateBudgetUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedBudget = await this.useCase.execute({
      actor: request.actor,
      details: {
        budgetId: request.params.budgetId as UUID,
      },
    });

    response.status(200).json(updatedBudget);
  }
}
