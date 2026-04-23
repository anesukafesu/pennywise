import { GetBudgetVsActualReportUseCase } from "@use-cases/reports/GetBudgetVsActualReport";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetBudgetVsActualReportController {
  constructor(private readonly useCase: GetBudgetVsActualReportUseCase) {}

  async handle(request: Request, response: Response) {
    const budgetVsActualReport = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        month: Number(request.params.month),
        year: Number(request.params.year),
      },
    });

    response.status(200).json(budgetVsActualReport);
  }
}
