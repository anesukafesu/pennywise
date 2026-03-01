import { AppwriteBudgetLineItemRow, BudgetLineItemRowData } from "@appwrite-models/BudgetLineItem";
import { toUUID } from "@domain/value-objects/toUUID";
import { BudgetLineItem, BudgetLineItem as BudgetLineItemEntity } from "@entities/BudgetLineItem";

export class BudgetLineItemMapper {
    static toPersistence(budgetLineItem: BudgetLineItemEntity): BudgetLineItemRowData {
        return {
            budgetId: budgetLineItem.budgetId,
            categoryId: budgetLineItem.categoryId,
            amount: budgetLineItem.amount,
        }
    }

    static fromPersistence(budgetLineItem: AppwriteBudgetLineItemRow) {
        return new BudgetLineItem(
            toUUID(budgetLineItem.$id),
            toUUID(budgetLineItem.budgetId),
            budgetLineItem.categoryId,
            budgetLineItem.amount,
        )
    }
}