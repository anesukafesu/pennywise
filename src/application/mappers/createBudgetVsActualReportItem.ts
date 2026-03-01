import { NotFound } from "@application/errors/NotFound";
import { UUID } from "node:crypto";
import { Category } from "@entities/Category";

export function createBudgetVsActualReportItem(
    categoryId: UUID,
    categoryMap: Map<UUID, Category>,
    budgetedAmount: number,
    actualAmount: number
) {
    const category = categoryMap.get(categoryId);

    if (!category) {
        throw new NotFound("category", categoryId);
    }

    return {
        categoryId: categoryId,
        categoryName: category.name,
        categoryClassification: category.classification,
        categorySubclassification: category.subclassification,
        budgetedAmount: budgetedAmount,
        actualAmount: actualAmount,
    }
}