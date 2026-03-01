import { Actor } from "@entities/Actor";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { BudgetLineItemRepository } from "@application/ports/repositories/BudgetLineItemRepository";
import { BudgetRepository } from "@application/ports/repositories/BudgetRepository";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { UUID } from "node:crypto";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";

interface DeleteWorkspaceDependencies {
  budgetLineItemRepository: BudgetLineItemRepository;
  budgetRepository: BudgetRepository;
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
  inviteRepository: InviteRepository;
  transactionRepository: TransactionRepository;
  workspaceRepository: WorkspaceRepository;
  transactionRunner: TransactionRunner;
}

interface DeleteWorkspaceInputs {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class DeleteWorkspaceUseCase {
  private readonly dependencies: DeleteWorkspaceDependencies;

  constructor(dependencies: DeleteWorkspaceDependencies) {
    this.dependencies = dependencies;
  }

  async execute({ actor, details }: DeleteWorkspaceInputs) {
    const {
      transactionRunner,
      collaborationRepository,
      inviteRepository,
      budgetRepository,
      budgetLineItemRepository,
      transactionRepository,
      categoryRepository,
      workspaceRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureActorOwnsWorkspace(
      actor,
      details.workspaceId,
      `Delete workspace (${details.workspaceId})`,
      collaborationRepository,
    );

    await transactionRunner.run(async (tx) => {
      // To prevent errors, dependents should be deleted before their dependencies.
      await collaborationRepository.deleteManyByWorkspaceId(
        details.workspaceId,
        tx,
      );
      await inviteRepository.deleteManyByWorkspaceId(details.workspaceId, tx);

      const workspaceBudgets = await budgetRepository.getManyByWorkspaceId(
        details.workspaceId,
        tx,
      );
      const workspaceBudgetIds = workspaceBudgets.map((b) => b.workspaceId);

      for (const budgetId of workspaceBudgetIds) {
        await budgetLineItemRepository.deleteManyByBudgetId(budgetId, tx);
      }

      await transactionRepository.deleteManyByWorkspaceId(
        details.workspaceId,
        tx,
      );
      await budgetRepository.deleteManyByWorkspaceId(details.workspaceId, tx);
      await categoryRepository.deleteManyByWorkspaceId(details.workspaceId, tx);
      await workspaceRepository.deleteOneById(details.workspaceId, tx);
    });
  }
}
