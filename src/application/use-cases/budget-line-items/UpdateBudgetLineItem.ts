import { BudgetLineItemDTO } from "@application/dtos/BudgetLineItemDTO";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureResourceExistsInWorkspace } from "@application/guards/ensureResourceExistsInWorkspace";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InvalidInput } from "@domain/errors/InvalidInput";
import { Actor } from "@entities/Actor";
import { BudgetLineItem } from "@entities/BudgetLineItem";
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
    amount?: number;
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

    if (details.amount === undefined) {
      throw new InvalidInput("The budget line item amount is required.");
    }

    const existingBudgetLineItem = await ensureResourceExists(
      "budgetLineItem",
      details.lineItemId,
      budgetLineItemRepository,
    );

    const budget = await ensureResourceExists(
      "budget",
      existingBudgetLineItem.budgetId,
      budgetRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      budget.workspaceId,
      "Update a budget line item",
      collaborationRepository,
    );

    const category = await ensureResourceExistsInWorkspace(
      "category",
      existingBudgetLineItem.categoryId,
      budget.workspaceId,
      categoryRepository,
    );

    const updatedBudgetLineItem = new BudgetLineItem(
      existingBudgetLineItem.id,
      existingBudgetLineItem.budgetId,
      existingBudgetLineItem.categoryId,
      details.amount,
    );

    await budgetLineItemRepository.updateOne(updatedBudgetLineItem);

    return {
      id: updatedBudgetLineItem.id,
      categoryId: category.id,
      categoryName: category.name,
      amount: updatedBudgetLineItem.amount,
    };
  }
}
