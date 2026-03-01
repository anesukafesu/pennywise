import { UUID } from "node:crypto";

export interface BudgetLineItemDTO {
    id: UUID;
    categoryId: string;
    categoryName: string;
    amount: number;
}