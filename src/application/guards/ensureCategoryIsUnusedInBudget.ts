import { ResourceConflict } from "@application/errors/ResourceConflict";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { UUID } from "node:crypto";

export async function ensureCategoryIsUnusedInBudget(
    budgetId: UUID,
    categoryId: UUID,
    budgetLineItemRepository: BudgetLineItemRepository,
) {
    const existingEntry = await budgetLineItemRepository
        .getOneByBudgetIdAndCategoryId(budgetId, categoryId);

    if (existingEntry) {
        throw new ResourceConflict(
            "Category has already been used in budget.",
        )
    }
}