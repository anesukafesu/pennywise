import { Transaction as TransactionEntity } from "@entities/Transaction";
import { Models } from "node-appwrite";

export interface TransactionRowData extends Omit<TransactionEntity, "id" | "workspaceId" | "date" | "categoryId"> {
    workspaceId: string;
    date: string;
    categoryId: string;
}

export interface AppwriteTransactionRow extends Models.Row, TransactionRowData {}