import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Budget } from "@entities/Budget";
import { UUID } from "node:crypto";

export interface BudgetRepository {
  createOne(budget: Budget, tx?: TransactionContext): Promise<void>;

  getOneById(id: UUID, tx?: TransactionContext): Promise<Budget | undefined>;

  getOneByWorkspaceIdAndMonth(
    workspaceId: UUID,
    year: number,
    month: number,
    tx?: TransactionContext,
  ): Promise<Budget | undefined>;

  getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Budget[]>;

  updateOne(budget: Budget, tx?: TransactionContext): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;

  deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void>;
}
