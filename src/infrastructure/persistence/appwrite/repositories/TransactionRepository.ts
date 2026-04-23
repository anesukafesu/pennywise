import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteTransactionRow } from "@appwrite-models/Transaction";
import { toUUID } from "@domain/value-objects/toUUID";
import { Transaction as TransactionEntity } from "@entities/Transaction";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { TransactionMapper } from "@infrastructure/persistence/appwrite/mappers/Transaction";
import { Models, Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteTransactionRepository implements TransactionRepository {
  private readonly tableId = "transactions";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    transaction: TransactionEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: transaction.id,
      data: TransactionMapper.toPersistence(transaction),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<TransactionEntity | undefined> {
    const transactionRow = await this.db.getRow<AppwriteTransactionRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!transactionRow) return undefined;
    return TransactionMapper.fromPersistence(transactionRow);
  }

  async getManyByWorkspaceId(
    workspaceId: string,
    tx?: TransactionContext,
  ): Promise<TransactionEntity[]> {
    const { rows } = await this.db.listRows<AppwriteTransactionRow>({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });

    return rows.map(TransactionMapper.fromPersistence);
  }

  async getCategoryTotalsForMonth(
    workspaceId: UUID,
    month: number,
    year: number,
    tx?: TransactionContext,
  ): Promise<{ categoryId: UUID; total: number }[]> {
    // TODO: Perform this aggregation on the database using a custom function
    interface Row extends Models.Row {
      categoryId: string;
      amount: number;
    }

    const { rows } = await this.db.listRows<Row>({
      tableId: this.tableId,
      queries: [
        Query.select(["categoryId", "amount"]),
        Query.equal("workspaceId", workspaceId),
        Query.equal("month", month),
        Query.equal("year", year),
      ],
      tx: tx,
    });

    const perCategoryTotal: Record<string, number> = {};

    for (const row of rows) {
      const categoryId = row.categoryId;
      const amount = row.amount;

      if (perCategoryTotal[categoryId] === undefined) {
        perCategoryTotal[categoryId] = amount;
      } else {
        perCategoryTotal[categoryId] += amount;
      }
    }

    return Object.entries(perCategoryTotal).map(([categoryId, total]) => ({
      categoryId: toUUID(categoryId),
      total: total,
    }));
  }

  async includesCategory(
    categoryId: UUID,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { rows } = await this.db.listRows<AppwriteTransactionRow>({
      tableId: this.tableId,
      queries: [Query.equal("categoryId", categoryId), Query.limit(1)],
      tx: tx,
    });

    return rows.length === 1;
  }

  async updateOne(
    transaction: TransactionEntity,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: transaction.id,
      data: TransactionMapper.toPersistence(transaction),
      tx: tx,
    });
  }

  async deleteOneById(id: UUID, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });
  }

  async deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });
  }
}
