import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { Actor } from "@entities/Actor";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { UUID } from "node:crypto";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";

interface TransferWorkspaceOwnershipDependencies {
  collaborationRepository: CollaborationRepository;
  transactionRunner: TransactionRunner;
}

interface TransferWorkspaceOwnershipInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
    successorId: UUID;
  };
}

export class TransferWorkspaceOwnershipUseCase {
  constructor(
    private readonly dependencies: TransferWorkspaceOwnershipDependencies,
  ) {}

  async execute({ actor, details }: TransferWorkspaceOwnershipInput) {
    const { collaborationRepository, transactionRunner } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    if (actor.id === details.successorId) {
      throw new InvalidInput("Cannot transfer ownership to current owner.");
    }

    const ownerCollaboration = await ensureActorOwnsWorkspace(
      actor,
      details.workspaceId,
      "Transfer Workspace Ownership",
      collaborationRepository,
    );

    const successorCollaboration =
      await collaborationRepository.getOneByUserIdAndWorkspaceId(
        details.successorId,
        details.workspaceId,
      );

    if (!successorCollaboration) {
      throw new InvalidInput(
        "User must be a collaborator to transfer ownership to them.",
      );
    }

    await transactionRunner.run(async (tx) => {
      await collaborationRepository.updateRole(
        ownerCollaboration.id,
        "collaborator",
        tx,
      );
      await collaborationRepository.updateRole(
        successorCollaboration.id,
        "owner",
        tx,
      );
    });
  }
}
