import { TransactionDTO } from "@application/dtos/TransactionDTO";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { Actor } from "@domain/entities/Actor";
import { UUID } from "node:crypto";

interface GetTransactionUseCaseDependencies {
  transactionRepository: TransactionRepository;
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
}

interface GetTransactionUseCaseInput {
  actor: Actor;
  details: {
    transactionId: UUID;
  };
}

export class GetTransactionUseCase {
  constructor(private dependencies: GetTransactionUseCaseDependencies) {}

  async execute({
    actor,
    details,
  }: GetTransactionUseCaseInput): Promise<TransactionDTO> {
    const {
      transactionRepository,
      collaborationRepository,
      categoryRepository,
    } = this.dependencies;

    const transaction = await ensureResourceExists(
      "transaction",
      details.transactionId,
      transactionRepository,
    );

    ensureActorHasAccessToWorkspace(
      actor,
      transaction.workspaceId,
      `Get transaction ${transaction.id}`,
      collaborationRepository,
    );

    const category = await ensureResourceExists(
      "category",
      transaction.categoryId,
      categoryRepository,
    );

    return {
      id: transaction.id,
      date: transaction.date,
      workspaceId: transaction.workspaceId,
      category: {
        id: category.id,
        name: category.name,
      },
      amount: transaction.amount,
      notes: transaction.notes,
      documentationUrl: transaction.documentationUrl,
    };
  }
}
