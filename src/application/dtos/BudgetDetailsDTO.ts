import { BudgetLineItemDTO } from "@application/dtos/BudgetLineItemDTO";
import { UUID } from "node:crypto";

export type BudgetDetailsDTO = {
    id: UUID;
    year: number;
    month: number;
    workspaceId: UUID;
    budgetLineItems: BudgetLineItemDTO[];
}