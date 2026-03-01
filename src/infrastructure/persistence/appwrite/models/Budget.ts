import { Budget  as BudgetEntity } from "@entities/Budget";
import { Models } from "node-appwrite";

export interface BudgetRowData extends Omit<BudgetEntity, "id"| "workspaceId"> {
    workspaceId: string;
}

export interface AppwriteBudgetRow extends Models.Row, BudgetRowData {}