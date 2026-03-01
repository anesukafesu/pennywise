import { AppwriteTransactionRow, TransactionRowData } from "@appwrite-models/Transaction";
import { toUUID } from "@domain/value-objects/toUUID";
import { Transaction as TransactionEntity } from "@entities/Transaction";

export class TransactionMapper {
    static toPersistence(transaction: TransactionEntity): TransactionRowData {
        return {
            workspaceId: transaction.workspaceId,
            date: transaction.date.toISOString(),
            categoryId: transaction.categoryId,
            amount: transaction.amount,
            notes: transaction.notes,
            documentationUrl: transaction.documentationUrl,
        }
    }

    static fromPersistence(transaction: AppwriteTransactionRow): TransactionEntity {
        return new TransactionEntity(
            toUUID(transaction.$id),
            toUUID(transaction.workspaceId),
            new Date(transaction.date),
            toUUID(transaction.categoryId),
            transaction.amount,
            transaction.notes,
            transaction.documentationUrl,
        )
    }
}