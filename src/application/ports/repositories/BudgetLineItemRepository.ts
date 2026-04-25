import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { BudgetLineItem } from "@entities/BudgetLineItem";
import { UUID } from "node:crypto";

export interface BudgetLineItemRepository {
  createOne(
    budgetLineItem: BudgetLineItem,
    tx?: TransactionContext,
  ): Promise<void>;

  getOneById(
    id: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem | undefined>;

  getOneByBudgetIdAndCategoryId(
    budgetId: UUID,
    categoryId: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem | undefined>;

  getManyByBudgetId(
    budgetId: UUID,
    tx?: TransactionContext,
  ): Promise<BudgetLineItem[]>;

  includesCategory(
    categoryId: string,
    tx?: TransactionContext,
  ): Promise<boolean>;

  updateOne(
    budgetLineItem: BudgetLineItem,
    tx?: TransactionContext,
  ): Promise<void>;

  deleteOneById(id: UUID, tx?: TransactionContext): Promise<void>;

  deleteManyByBudgetId(
    budgetId: string,
    tx?: TransactionContext,
  ): Promise<void>;
}
