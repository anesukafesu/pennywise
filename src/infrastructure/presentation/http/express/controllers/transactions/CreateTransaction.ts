import { CreateTransactionUseCase } from "@use-cases/transactions/CreateTransaction";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class CreateTransactionController {
  constructor(private readonly useCase: CreateTransactionUseCase) {}

  async handle(request: Request, response: Response) {
    const transaction = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        // TODO: Find a way of handling cases where the date passed is invalid.
        date: new Date(request.body.date),
        categoryId: request.body.categoryId as UUID,
        amount: request.body.amount,
        notes: request.body.notes,
        documentationUrl: request.body.documentationUrl,
      },
    });

    response.status(201).json(transaction);
  }
}
