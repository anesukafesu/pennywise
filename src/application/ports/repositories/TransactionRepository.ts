import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { Transaction } from "@entities/Transaction";
import { UUID } from "node:crypto";

export interface TransactionRepository {
  createOne(transaction: Transaction, tx?: TransactionContext): Promise<void>;

  updateOne(transaction: Transaction, tx?: TransactionContext): Promise<void>;

  getOneById(
    transactionId: UUID,
    tx?: TransactionContext,
  ): Promise<Transaction | undefined>;

  deleteManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<void>;

  includesCategory(categoryId: UUID, tx?: TransactionContext): Promise<boolean>;

  deleteOneById(transactionId: UUID, tx?: TransactionContext): Promise<void>;

  getManyByWorkspaceId(
    workspaceId: UUID,
    tx?: TransactionContext,
  ): Promise<Transaction[]>;

  getCategoryTotalsForMonth(
    workspaceId: UUID,
    year: number,
    month: number,
    tx?: TransactionContext,
  ): Promise<{ categoryId: UUID; total: number }[]>;
}
