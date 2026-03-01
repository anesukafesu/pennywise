import { TransactionContext } from "@application/ports/services/TransactionRunner";
import { UUID } from "node:crypto";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";

export async function ensureCategoryHasNoDependents(
  categoryId: UUID,
  transactionRepository: TransactionRepository,
  budgetLineItemRepository: BudgetLineItemRepository,
  tx?: TransactionContext,
) {
  const hasTransactions = await transactionRepository.includesCategory(
    categoryId,
    tx,
  );

  if (hasTransactions) {
    throw new InvalidInput(
      "Category cannot be deleted because it has transactions assigned to it.",
    );
  }

  const hasBudgetLineItems = await budgetLineItemRepository.includesCategory(
    categoryId,
    tx,
  );

  if (hasBudgetLineItems) {
    throw new InvalidInput(
      "Category cannot be deleted because it has budget line items assigned to it.",
    );
  }
}
