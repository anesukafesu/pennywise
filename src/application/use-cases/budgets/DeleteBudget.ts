import { Actor } from "@entities/Actor";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { UUID } from "node:crypto";

interface DeleteBudgetDependencies {
  budgetRepository: BudgetRepository;
  budgetLineItemRepository: BudgetLineItemRepository;
  collaborationRepository: CollaborationRepository;
  transactionRunner: TransactionRunner;
}

interface DeleteBudgetInput {
  actor: Actor;
  details: {
    budgetId: UUID;
  };
}

export class DeleteBudgetUseCase {
  constructor(private readonly dependencies: DeleteBudgetDependencies) {}

  async execute({ actor, details }: DeleteBudgetInput): Promise<void> {
    const {
      budgetRepository,
      budgetLineItemRepository,
      collaborationRepository,
      transactionRunner,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const budget = await ensureResourceExists(
      "budget",
      details.budgetId,
      budgetRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      budget.workspaceId,
      "Delete a budget",
      collaborationRepository,
    );

    await transactionRunner.run(async (tx) => {
      await budgetLineItemRepository.deleteManyByBudgetId(details.budgetId, tx);
      await budgetRepository.deleteOneById(details.budgetId, tx);
    });
  }
}
