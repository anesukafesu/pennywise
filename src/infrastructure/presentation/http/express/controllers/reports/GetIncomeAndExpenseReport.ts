import { GetIncomeAndExpenseReportUseCase } from "@use-cases/reports/GetIncomeAndExpenseReport";
import { Request, Response } from "express";
import { UUID } from "node:crypto";

export class GetIncomeAndExpenseReportController {
  constructor(private readonly useCase: GetIncomeAndExpenseReportUseCase) {}

  async handle(request: Request, response: Response) {
    const incomeAndExpenseReport = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        year: request.params.year,
        month: request.params.month,
      },
    });

    response.status(200).json(incomeAndExpenseReport);
  }
}
