import { BudgetLineItem as BudgetLineItemEntity } from "@entities/BudgetLineItem";
import { Models } from "node-appwrite";

export interface BudgetLineItemRowData extends Omit<BudgetLineItemEntity, "id" | "budgetId"> {
    budgetId: string;
}

export interface AppwriteBudgetLineItemRow extends Models.Row, BudgetLineItemEntity {}