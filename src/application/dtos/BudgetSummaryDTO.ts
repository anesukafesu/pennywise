import { UUID } from "node:crypto";

export type BudgetSummaryDTO = {
    id: UUID;
    year: number;
    month: number;
    workspaceId: UUID;
}