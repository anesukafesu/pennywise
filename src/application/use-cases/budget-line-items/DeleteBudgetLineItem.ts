import { Actor } from "@entities/Actor";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface DeleteBudgetLineItemDependencies {
  budgetLineItemRepository: BudgetLineItemRepository;
  budgetRepository: BudgetRepository;
  collaborationRepository: CollaborationRepository;
}

interface DeleteBudgetLineItemInput {
  actor: Actor;
  details: {
    lineItemId: UUID;
  };
}

export class DeleteBudgetLineItemUseCase {
  constructor(
    private readonly dependencies: DeleteBudgetLineItemDependencies,
  ) {}

  async execute({ actor, details }: DeleteBudgetLineItemInput) {
    const {
      budgetLineItemRepository,
      collaborationRepository,
      budgetRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const budgetLineItem = await ensureResourceExists(
      "budgetLineItem",
      details.lineItemId,
      budgetLineItemRepository,
    );

    const budget = await ensureResourceExists(
      "budget",
      budgetLineItem.budgetId,
      budgetRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      budget.workspaceId,
      "Delete a budget line item",
      collaborationRepository,
    );

    await budgetLineItemRepository.deleteOneById(details.lineItemId);
  }
}
