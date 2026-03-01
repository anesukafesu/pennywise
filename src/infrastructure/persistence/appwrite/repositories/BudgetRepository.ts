import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { AppwriteBudgetRow } from "@appwrite-models/Budget";
import { Budget } from "@entities/Budget";
import { AppwriteDatabaseService } from "@appwrite/client/AppwriteDatabaseService";
import { BudgetMapper } from "@infrastructure/persistence/appwrite/mappers/Budget";
import { Query } from "node-appwrite";
import { UUID } from "node:crypto";

export class AppwriteBudgetRepository implements BudgetRepository {
  private readonly tableId = "budgets";

  constructor(private readonly db: AppwriteDatabaseService) {}

  async createOne(budget: Budget, tx?: TransactionContext): Promise<void> {
    await this.db.createRow({
      tableId: this.tableId,
      rowId: budget.id,
      data: BudgetMapper.toPersistence(budget),
      tx: tx,
    });
  }

  async getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<Budget | undefined> {
    const budgetRow = await this.db.getRow<AppwriteBudgetRow>({
      tableId: this.tableId,
      rowId: id,
      tx: tx,
    });

    if (!budgetRow) return undefined;
    else return BudgetMapper.fromPersistence(budgetRow);
  }

  async getOneByWorkspaceIdAndMonth(
    workspaceId: string,
    year: number,
    month: number,
    tx?: TransactionContext,
  ): Promise<Budget | undefined> {
    const { rows } = await this.db.listRows<AppwriteBudgetRow>({
      tableId: this.tableId,
      queries: [
        Query.equal("workspaceId", workspaceId),
        Query.equal("year", year),
        Query.equal("month", month),
      ],
      tx: tx,
    });

    if (rows.length === 0) return undefined;
    return BudgetMapper.fromPersistence(rows[0]);
  }

  async getManyByWorkspaceId(
    workspaceId: string,
    tx?: TransactionContext,
  ): Promise<Budget[]> {
    const { rows } = await this.db.listRows<AppwriteBudgetRow>({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });

    return rows.map(BudgetMapper.fromPersistence);
  }

  async updateOne(budget: Budget, tx?: TransactionContext): Promise<void> {
    await this.db.updateRow({
      tableId: this.tableId,
      rowId: budget.id,
      data: BudgetMapper.toPersistence(budget),
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

  async deleteManyByWorkspaceId(workspaceId: UUID, tx?: TransactionContext) {
    await this.db.deleteRows({
      tableId: this.tableId,
      queries: [Query.equal("workspaceId", workspaceId)],
      tx: tx,
    });
  }
}
