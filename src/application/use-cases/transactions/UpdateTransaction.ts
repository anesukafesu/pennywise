import { TransactionDTO } from "@application/dtos/TransactionDTO";
import { InvalidInput } from "@domain/errors/InvalidInput";
import { Actor } from "@entities/Actor";
import { Transaction } from "@entities/Transaction";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureResourceExistsInWorkspace } from "@application/guards/ensureResourceExistsInWorkspace";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { UUID } from "node:crypto";

interface UpdateTransactionDependencies {
  transactionRepository: TransactionRepository;
  categoryRepository: CategoryRepository;
  collaborationRepository: CollaborationRepository;
}

interface UpdateTransactionInput {
  actor: Actor;
  details: {
    transactionId: UUID;
    date?: Date;
    categoryId?: UUID;
    amount?: number;
    notes?: string;
    documentationUrl?: string;
  };
}

export class UpdateTransactionUseCase {
  constructor(private readonly dependencies: UpdateTransactionDependencies) {}

  async execute({
    actor,
    details,
  }: UpdateTransactionInput): Promise<TransactionDTO> {
    const {
      transactionRepository,
      collaborationRepository,
      categoryRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    // TODO: Find a correct way of checking if there are no updated fields.
    if (Object.keys(details).length === 0) {
      throw new InvalidInput("Expected at least one field to update.");
    }

    const transaction = await ensureResourceExists(
      "transaction",
      details.transactionId,
      transactionRepository,
    );

    await ensureActorHasAccessToWorkspace(
      actor,
      transaction.workspaceId,
      "Update a transaction",
      collaborationRepository,
    );

    const updatedTransaction = new Transaction(
      details.transactionId,
      transaction.workspaceId,
      details.date ?? transaction.date,
      details.categoryId ?? transaction.categoryId,
      details.amount ?? transaction.amount,
      details.notes ?? transaction.notes,
      details.documentationUrl ?? transaction.documentationUrl,
    );

    // Ensure whichever category is being used exists
    const category = await ensureResourceExistsInWorkspace(
      "category",
      updatedTransaction.categoryId,
      transaction.workspaceId,
      categoryRepository,
    );

    await transactionRepository.updateOne(updatedTransaction);

    return {
      id: transaction.id,
      date: updatedTransaction.date,
      workspaceId: transaction.workspaceId,
      amount: updatedTransaction.amount,
      category: {
        id: category.id,
        name: category.name,
      },
      notes: updatedTransaction.notes,
      documentationUrl: updatedTransaction.documentationUrl,
    };
  }
}
