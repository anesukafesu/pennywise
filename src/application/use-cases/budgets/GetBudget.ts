import { BudgetDetailsDTO } from "@application/dtos/BudgetDetailsDTO";
import { BudgetSummaryDTO } from "@application/dtos/BudgetSummaryDTO";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { Actor } from "@entities/Actor";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { mapBudgetLineItemsToDTOs } from "@application/mappers/mapBudgetLineItemsToDTOs";
import { UUID } from "node:crypto";

interface GetBudgetDependencies {
  collaborationRepository: CollaborationRepository;
  budgetLineItemRepository: BudgetLineItemRepository;
  budgetRepository: BudgetRepository;
  categoryRepository: CategoryRepository;
}

interface GetBudgetInput {
  actor: Actor;
  details: {
    budgetId: UUID;
  };
}

export class GetBudgetUseCase {
  constructor(private readonly dependencies: GetBudgetDependencies) {}

  async execute({ actor, details }: GetBudgetInput): Promise<BudgetDetailsDTO> {
    const {
      collaborationRepository,
      budgetRepository,
      budgetLineItemRepository,
      categoryRepository,
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
      "Read a budget",
      collaborationRepository,
    );

    const budgetLineItems = await budgetLineItemRepository.getManyByBudgetId(
      budget.id,
    );

    const categoryMap = await categoryRepository.getWorkspaceCategoriesAsMap(
      budget.workspaceId,
    );

    const budgetLineItemDTOs = mapBudgetLineItemsToDTOs(
      budgetLineItems,
      categoryMap,
    );

    return {
      ...budget,
      budgetLineItems: budgetLineItemDTOs,
    };
  }
}
