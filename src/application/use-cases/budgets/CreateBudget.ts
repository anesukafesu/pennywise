import { BudgetSummaryDTO } from "@application/dtos/BudgetSummaryDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { Actor } from "@entities/Actor";
import { Budget } from "@entities/Budget";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { ensureNoBudgetExistsForPeriod } from "@application/guards/ensureNoBudgetExistsForPeriod";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { UUID } from "node:crypto";

interface CreateBudgetDependencies {
  budgetRepository: BudgetRepository;
  collaborationRepository: CollaborationRepository;
  workspaceRepository: WorkspaceRepository;
  idGenerator: IDGenerator;
}

interface CreateBudgetInput {
  actor: Actor;
  details: {
    year: number;
    month: number;
    workspaceId: UUID;
  };
}

export class CreateBudgetUseCase {
  constructor(private readonly dependencies: CreateBudgetDependencies) {}

  async execute({
    actor,
    details,
  }: CreateBudgetInput): Promise<BudgetSummaryDTO> {
    const {
      budgetRepository,
      collaborationRepository,
      workspaceRepository,
      idGenerator,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Create a budget",
      collaborationRepository,
    );

    await ensureNoBudgetExistsForPeriod(
      details.year,
      details.month,
      details.workspaceId,
      budgetRepository,
    );

    const budget = new Budget(
      idGenerator.generate(),
      details.workspaceId,
      details.year,
      details.month,
    );

    await budgetRepository.createOne(budget);

    return {
      ...budget,
    };
  }
}
