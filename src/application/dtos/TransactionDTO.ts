import { UUID } from "node:crypto";

export interface TransactionDTO {
    id: UUID;
    workspaceId: UUID;
    date: Date;
    categoryId: UUID;
    categoryName: string;
    amount: number;
    notes: string;
    documentationUrl: string;
}