import { GetWorkspaceTransactionsUseCase } from "@use-cases/transactions/GetWorkspaceTransactions";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetWorkspaceTransactionsController {
  constructor(private readonly useCase: GetWorkspaceTransactionsUseCase) {}

  async handle(request: Request, response: Response) {
    const transactions = await this.useCase.execute({
      actor: request.actor,
      details: { workspaceId: request.params.workspaceId as UUID },
    });

    response.status(200).json(transactions);
  }
}
