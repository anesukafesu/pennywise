import { UpdateBudgetLineItemUseCase } from "@use-cases/budget-line-items/UpdateBudgetLineItem";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class UpdateBudgetLineItemController {
  constructor(private readonly useCase: UpdateBudgetLineItemUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedBudgetLineItem = await this.useCase.execute({
      actor: request.actor,
      details: {
        lineItemId: request.body.lineItemId,
        amount: request.body.amount,
      },
    });

    response.status(200).json(updatedBudgetLineItem);
  }
}
