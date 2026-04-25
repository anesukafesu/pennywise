import { DeleteBudgetLineItemUseCase } from "@use-cases/budget-line-items/DeleteBudgetLineItem";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeleteBudgetLineItemController {
  constructor(private readonly useCase: DeleteBudgetLineItemUseCase) {}

  async handle(req: Request, res: Response) {
    await this.useCase.execute({
      actor: req.actor,
      details: {
        lineItemId: req.params.lineItemId as UUID,
      },
    });

    res.status(204).end();
  }
}
