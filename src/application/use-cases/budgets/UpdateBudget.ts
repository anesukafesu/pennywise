import { BudgetSummaryDTO } from "@application/dtos/BudgetSummaryDTO";
import { Actor } from "@entities/Actor";
import { Budget } from "@entities/Budget";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureNoBudgetExistsForPeriod } from "@application/guards/ensureNoBudgetExistsForPeriod";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface UpdateBudgetDependencies {
  budgetRepository: BudgetRepository;
  collaborationRepository: CollaborationRepository;
}

interface UpdateBudgetInput {
  actor: Actor;
  details: {
    budgetId: UUID;
    year?: number;
    month?: number;
  };
}

export class UpdateBudgetUseCase {
  constructor(private readonly dependencies: UpdateBudgetDependencies) {}

  async execute({
    actor,
    details,
  }: UpdateBudgetInput): Promise<BudgetSummaryDTO> {
    const { budgetRepository, collaborationRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const budget = await ensureResourceExists(
      "budget",
      details.budgetId,
      budgetRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      budget.workspaceId,
      "Update a budget",
      collaborationRepository,
    );

    await ensureNoBudgetExistsForPeriod(
      details.year ?? budget.year,
      details.month ?? budget.month,
      budget.workspaceId,
      budgetRepository,
    );

    const updatedBudget = new Budget(
      budget.id,
      budget.workspaceId,
      details.year ?? budget.year,
      details.month ?? budget.month,
    );

    await budgetRepository.updateOne(updatedBudget);

    return {
      ...updatedBudget,
    };
  }
}
