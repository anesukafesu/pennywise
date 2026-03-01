import { UpdateTransactionUseCase } from "@use-cases/transactions/UpdateTransaction";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class UpdateTransactionController {
  constructor(private readonly useCase: UpdateTransactionUseCase) {}

  async handle(request: Request, response: Response) {
    const updatedTransaction = await this.useCase.execute({
      actor: request.actor,
      details: {
        transactionId: request.params.transactionId as UUID,
        // TODO: Find a way of handling cases where the date passed is invalid.
        date: request.body.date ? new Date(request.body.date) : undefined,
        categoryId: request.body.categoryId,
        amount: request.body.amount,
        notes: request.body.notes,
        documentationUrl: request.body.documentationUrl,
      },
    });

    response.status(200).json(updatedTransaction);
  }
}
