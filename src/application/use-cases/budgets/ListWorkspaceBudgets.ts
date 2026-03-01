import { BudgetSummaryDTO } from "@application/dtos/BudgetSummaryDTO";
import { Actor } from "@entities/Actor";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface GetWorkspaceBudgetsDependencies {
  budgetRepository: BudgetRepository;
  collaborationRepository: CollaborationRepository;
  workspaceRepository: WorkspaceRepository;
}

interface GetWorkspaceBudgetsInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class ListWorkspaceBudgetsUseCase {
  constructor(private readonly dependencies: GetWorkspaceBudgetsDependencies) {}

  async execute({
    actor,
    details,
  }: GetWorkspaceBudgetsInput): Promise<BudgetSummaryDTO[]> {
    const { budgetRepository, collaborationRepository, workspaceRepository } =
      this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Read budgets",
      collaborationRepository,
    );

    return budgetRepository.getManyByWorkspaceId(details.workspaceId);
  }
}
