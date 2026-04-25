import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteBudgetLineItemRow } from "@appwrite-models/BudgetLineItem";
import { BudgetLineItem } from "@entities/BudgetLineItem";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { BudgetLineItemMapper } from "@infrastructure/persistence/appwrite/mappers/BudgetLineItem";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteBudgetLineItemRepository implements BudgetLineItemRepository {
  private readonly tableId = "budget_line_items";
  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(
    budgetLineItem: BudgetLineItem,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: budgetLineItem.id,
      data: BudgetLineItemMapper.toPersistence(budgetLineItem),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem | undefined> {
    const budgetLineItemRow = await this.db.getRow<AppwriteBudgetLineItemRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!budgetLineItemRow) return undefined;
    return BudgetLineItemMapper.fromPersistence(budgetLineItemRow);
  }

  async getOneByBudgetIdAndCategoryId(
    budgetId: UUID,
    categoryId: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem | undefined> {
    const { rows } = await this.db.listRows<AppwriteBudgetLineItemRow>({
      tableId: this.tableId,
      queries: [
        Query.equal("budgetId", budgetId),
        Query.equal("categoryId", categoryId),
      ],
      tx: tx,
    });

    if (rows.length === 0) return undefined;
    return BudgetLineItemMapper.fromPersistence(rows[0]);
  }

  async getManyByBudgetId(
    budgetId: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem[]> {
    const { rows } = await this.db.listRows<AppwriteBudgetLineItemRow>({
      tableId: this.tableId,
      queries: [Query.equal("budgetId", budgetId)],
      tx: tx,
    });

    return rows.map(BudgetLineItemMapper.fromPersistence);
  }

  async updateOne(
    budgetLineItem: BudgetLineItem,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: budgetLineItem.id,
      data: BudgetLineItemMapper.toPersistence(budgetLineItem),
      tx: tx,
    });
  }

  async includesCategory(
    categoryId: string,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const { rows } = await this.db.listRows<AppwriteBudgetLineItemRow>({
      tableId: this.tableId,
      queries: [Query.equal("categoryId", categoryId), Query.limit(1)],
      tx: tx,
    });

    return rows.length === 1;
  }

  async deleteOneById(id: string, tx?: TransactionContext): Promise<void> {
    await this.db.deleteRow({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });
  }

  async deleteManyByBudgetId(
    budgetId: string,
    tx?: TransactionContext,
  ): Promise<void> {
    await this.db.deleteRows({
      tableId: this.tableId,
      queries: [Query.equal("budgetId", budgetId)],
      tx: tx,
    });
  }
}
