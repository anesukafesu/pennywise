import { NotFound } from "@application/errors/NotFound";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { Actor } from "@entities/Actor";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { UUID } from "node:crypto";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { ensureCategoryHasNoDependents } from "@application/guards/ensureCategoryHasNoDependents";

interface DeleteCategoryDependencies {
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
  transactionRepository: TransactionRepository;
  budgetLineItemRepository: BudgetLineItemRepository;
  transactionRunner: TransactionRunner;
}

interface DeleteCategoryInput {
  actor: Actor;
  details: {
    categoryId: UUID;
  };
}

export class DeleteCategoryUseCase {
  constructor(private readonly dependencies: DeleteCategoryDependencies) {}

  async execute({ actor, details }: DeleteCategoryInput) {
    const {
      categoryRepository,
      collaborationRepository,
      transactionRepository,
      budgetLineItemRepository,
      transactionRunner,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const category = await ensureResourceExists(
      "category",
      details.categoryId,
      categoryRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      category.workspaceId,
      "Delete a category",
      collaborationRepository,
    );

    await transactionRunner.run(async (tx) => {
      await ensureCategoryHasNoDependents(
        details.categoryId,
        transactionRepository,
        budgetLineItemRepository,
        tx,
      );

      await categoryRepository.deleteOneById(details.categoryId, tx);
    });
  }
}
