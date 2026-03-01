import { GetBudgetUseCase } from "@use-cases/budgets/GetBudget";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetBudgetController {
  constructor(private readonly useCase: GetBudgetUseCase) {}

  async handle(request: Request, response: Response) {
    const budget = await this.useCase.execute({
      actor: request.actor,
      details: {
        budgetId: request.params.budgetId as UUID,
      },
    });

    response.status(200).json(budget);
  }
}
