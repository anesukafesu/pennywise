import { BudgetLineItemDTO } from "@application/dtos/BudgetLineItemDTO";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { Actor } from "@domain/entities/Actor";
import { UUID } from "node:crypto";

interface GetBudgetLineItemUseCaseDependencies {
  budgetLineItemRepository: BudgetLineItemRepository;
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
  budgetRepository: BudgetRepository;
}

interface GetBudgetLineItemUseCaseInput {
  actor: Actor;
  data: {
    budgetLineItemId: UUID;
  };
}

export class GetBudgetLineItemUseCase {
  constructor(
    private readonly dependencies: GetBudgetLineItemUseCaseDependencies,
  ) {}

  async execute({
    actor,
    data: { budgetLineItemId },
  }: GetBudgetLineItemUseCaseInput): Promise<BudgetLineItemDTO> {
    const {
      budgetRepository,
      budgetLineItemRepository,
      collaborationRepository,
      categoryRepository,
    } = this.dependencies;

    const budgetLineItem = await ensureResourceExists(
      "budgetLineItem",
      budgetLineItemId,
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
      `Get budget line item (${budgetLineItemId}).`,
      collaborationRepository,
    );

    const category = await ensureResourceExists(
      "category",
      budgetLineItem.categoryId,
      categoryRepository,
    );

    return {
      id: budgetLineItem.id,
      categoryId: budgetLineItem.categoryId,
      categoryName: category.name,
      amount: budgetLineItem.amount,
    };
  }
}
