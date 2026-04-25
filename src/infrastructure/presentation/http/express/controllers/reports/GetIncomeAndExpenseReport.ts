import { GetIncomeAndExpenseReportUseCase } from "@use-cases/reports/GetIncomeAndExpenseReport";
import { Request, Response } from "express";
import { UUID } from "node:crypto";
import { InvalidInput } from "@domain/errors/InvalidInput";

const MIN_YEAR = 1900;
const MAX_YEAR = 3000;

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim().length > 0) {
    return Number(value);
  }
  return Number.NaN;
}

function parseReportPeriod(request: Request) {
  const year = toNumber(request.query.year ?? request.params.year);
  const month = toNumber(request.query.month ?? request.params.month);

  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    throw new InvalidInput(`year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`);
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new InvalidInput("month must be an integer between 1 and 12");
  }

  return { year, month };
}

export class GetIncomeAndExpenseReportController {
  constructor(private readonly useCase: GetIncomeAndExpenseReportUseCase) {}

  async handle(request: Request, response: Response) {
    const { month, year } = parseReportPeriod(request);

    const incomeAndExpenseReport = await this.useCase.execute({
      actor: request.actor,
      details: {
        workspaceId: request.params.workspaceId as UUID,
        year,
        month,
      },
    });

    response.status(200).json(incomeAndExpenseReport);
  }
}
