import { DeleteTransactionUseCase } from "@use-cases/transactions/DeleteTransaction";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class DeleteTransactionController {
  constructor(private readonly useCase: DeleteTransactionUseCase) {}

  async handle(request: Request, response: Response) {
    await this.useCase.execute({
      actor: request.actor,
      details: {
        transactionId: request.params.transactionId as UUID,
      },
    });

    response.status(204).end();
  }
}
