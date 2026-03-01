import { BudgetLineItemDTO } from "@application/dtos/BudgetLineItemDTO";
import { NotFound } from "@application/errors/NotFound";
import { BudgetLineItem } from "@entities/BudgetLineItem";
import { Category } from "@entities/Category";
import { UUID } from "node:crypto";

export function mapBudgetLineItemsToDTOs(
    budgetLineItems: BudgetLineItem[],
    categoryMap: Map<UUID, Category>
): BudgetLineItemDTO[] {

    return budgetLineItems.map(lineItem => {
        const category = categoryMap.get(lineItem.categoryId);

        if (!category) {
            throw new NotFound("category", lineItem.categoryId);
        }

        return {
            id: lineItem.id,
            categoryId: lineItem.categoryId,
            categoryName: category.name,
            amount: lineItem.amount,
        }
    })
}