import { Actor } from "@entities/Actor";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface DeleteTransactionDependencies {
  transactionRepository: TransactionRepository;
  collaborationRepository: CollaborationRepository;
}

interface DeleteTransactionInput {
  actor: Actor;
  details: {
    transactionId: UUID;
  };
}

export class DeleteTransactionUseCase {
  constructor(private readonly dependencies: DeleteTransactionDependencies) {}

  async execute({ actor, details }: DeleteTransactionInput) {
    const { transactionRepository, collaborationRepository } =
      this.dependencies;

    ensureActorIsAuthenticated(actor);

    const transaction = await ensureResourceExists(
      "transaction",
      details.transactionId,
      transactionRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      transaction.workspaceId,
      "Delete a transaction",
      collaborationRepository,
    );

    await transactionRepository.deleteOneById(transaction.id);
  }
}
