import { UUID } from "node:crypto";

interface IncomeAndExpenseReportItem {
    categoryId: UUID;
    categoryName: string;
    categoryClassification: "income" | "expense";
    categorySubclassification: string;
    amount: number;
}


export interface IncomeAndExpenseReportDTO {
    workspaceId: UUID,
    year: number;
    month: number;
    items: IncomeAndExpenseReportItem[]
}