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
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { UUID } from "node:crypto";

interface CreateBudgetLineItemDependencies {
  budgetLineItemRepository: BudgetLineItemRepository;
  budgetRepository: BudgetRepository;
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
  idGenerator: IDGenerator;
}

interface CreateBudgetLineItemInput {
  actor: Actor;
  details: {
    budgetId: UUID;
    categoryId: UUID;
    amount: number;
  };
}

export class CreateBudgetLineItemUseCase {
  constructor(
    private readonly dependencies: CreateBudgetLineItemDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: CreateBudgetLineItemInput): Promise<BudgetLineItemDTO> {
    ensureActorIsAuthenticated(actor);

    const {
      budgetLineItemRepository,
      budgetRepository,
      collaborationRepository,
      categoryRepository,
      idGenerator,
    } = this.dependencies;

    const budget = await ensureResourceExists(
      "budget",
      details.budgetId,
      budgetRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      budget.workspaceId,
      "Create a budget line item.",
      collaborationRepository,
    );

    const category = await ensureResourceExistsInWorkspace(
      "category",
      details.categoryId,
      budget.workspaceId,
      categoryRepository,
    );

    await ensureCategoryIsUnusedInBudget(
      budget.id,
      category.id,
      budgetLineItemRepository,
    );

    const budgetLineItem = new BudgetLineItem(
      idGenerator.generate(),
      details.budgetId,
      details.categoryId,
      details.amount,
    );

    await budgetLineItemRepository.createOne(budgetLineItem);

    return {
      id: budgetLineItem.id,
      categoryId: category.id,
      categoryName: category.name,
      amount: budgetLineItem.amount,
    };
  }
}
