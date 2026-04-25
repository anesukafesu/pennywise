import { BudgetLineItemDTO } from "@application/dtos/BudgetLineItemDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { Actor } from "@entities/Actor";
import { BudgetLineItem } from "@entities/BudgetLineItem";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureCategoryIsUnusedInBudget } from "@application/guards/ensureCategoryIsUnusedInBudget";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureResourceExistsInWorkspace } from "@application/guards/ensureResourceExistsInWorkspace";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface UpdateBudgetLineItemDependencies {
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
  budgetRepository: BudgetRepository;
  budgetLineItemRepository: BudgetLineItemRepository;
}

interface UpdateBudgetLineItemInput {
  actor: Actor;
  details: {
    lineItemId: UUID;
    amount: number;
  };
}

export class UpdateBudgetLineItemUseCase {
  constructor(
    private readonly dependencies: UpdateBudgetLineItemDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: UpdateBudgetLineItemInput): Promise<BudgetLineItemDTO> {
    const {
      categoryRepository,
      budgetLineItemRepository,
      collaborationRepository,
      budgetRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    if (Object.keys(details).length === 0) {
      throw new InvalidInput("Expected at least one property to update.");
    }

    const existingBudgetLineItem = await ensureResourceExists(
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
      "Update a budget line item",
      collaborationRepository,
    );

    const updatedBudgetLineItem = new BudgetLineItem(
      existingBudgetLineItem.id
      existingBudgetLineItem.budgetId,
      existingBudgetLineItem.categoryId,
      details.amount,
    );

    await budgetLineItemRepository.updateOne(updatedBudgetLineItem);

    return {
      id: updatedBudgetLineItem.id,
      categoryId: budgetLineItem.categoryId,
      categoryName: category.name,
      amount: updatedBudgetLineItem.amount,
    };
  }
}
