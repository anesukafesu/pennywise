import { UUID } from "node:crypto";

export interface BudgetVsActualReportItem {
    categoryId: UUID;
    categoryName: string;
    categoryClassification: "income" | "expense";
    categorySubclassification: string;
    budgetedAmount: number;
    actualAmount: number;
}

export interface BudgetVsActualReportDTO {
    workspaceId: UUID;
    year: number;
    month: number;
    items: BudgetVsActualReportItem[];
}