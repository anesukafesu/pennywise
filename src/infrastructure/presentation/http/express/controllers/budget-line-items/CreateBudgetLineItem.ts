import { CreateBudgetLineItemUseCase } from "@use-cases/budget-line-items/CreateBudgetLineItem";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class CreateBudgetLineItemController {
  constructor(private readonly useCase: CreateBudgetLineItemUseCase) {}

  async handle(req: Request, res: Response) {
    const budgetLineItem = await this.useCase.execute({
      actor: req.actor,
      details: {
        budgetId: req.params.budgetId as UUID,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
      },
    });

    res.status(200).json(budgetLineItem);
  }
}
