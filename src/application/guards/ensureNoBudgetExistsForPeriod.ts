import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { UUID } from "node:crypto";

export async function ensureNoBudgetExistsForPeriod(
    year: number,
    month: number,
    workspaceId: UUID,
    budgetRepository: BudgetRepository,
) {
    const budget = await budgetRepository
        .getOneByWorkspaceIdAndMonth(workspaceId, year, month);

    if (budget) {
        throw new InvalidInput("Budget for month already exists.");
    }
}