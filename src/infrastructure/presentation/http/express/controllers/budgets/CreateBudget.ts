import { CreateBudgetUseCase } from "@use-cases/budgets/CreateBudget";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class CreateBudgetController {
  constructor(private readonly useCase: CreateBudgetUseCase) {}

  async handle(request: Request, response: Response) {
    const budget = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        year: request.body.year,
        month: request.body.month,
      },
    });

    response.status(201).json(budget);
  }
}
