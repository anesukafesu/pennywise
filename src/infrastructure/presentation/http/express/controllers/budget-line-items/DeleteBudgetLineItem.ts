import { DeleteBudgetLineItemUseCase } from "@use-cases/budget-line-items/DeleteBudgetLineItem";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeleteBudgetLineItemController {
  constructor(private readonly useCase: DeleteBudgetLineItemUseCase) {}

  async handle(req: Request, res: Response) {
    await this.useCase.execute({
      actor: req.actor,
      details: {
        budgetLineItemId: req.params.budgetLineItemId as UUID,
      },
    });

    res.status(204).end();
  }
}
