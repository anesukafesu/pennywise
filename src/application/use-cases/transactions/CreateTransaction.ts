import { TransactionDTO } from "@application/dtos/TransactionDTO";
import { Actor } from "@entities/Actor";
import { Transaction } from "@entities/Transaction";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExistsInWorkspace } from "@application/guards/ensureResourceExistsInWorkspace";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { UUID } from "node:crypto";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";

interface CreateTransactionDependencies {
  transactionRepository: TransactionRepository;
  collaborationRepository: CollaborationRepository;
  categoryRepository: CategoryRepository;
  idGenerator: IDGenerator;
}

interface CreateTransactionInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
    date: Date;
    categoryId: UUID;
    amount: number;
    notes?: string;
    documentationUrl?: string;
  };
}

export class CreateTransactionUseCase {
  constructor(private readonly dependencies: CreateTransactionDependencies) {}

  async execute({
    actor,
    details,
  }: CreateTransactionInput): Promise<TransactionDTO> {
    const {
      transactionRepository,
      collaborationRepository,
      categoryRepository,
      idGenerator,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    // Ensure requestor is a collaborator in the workspace
    await ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Create a transaction",
      collaborationRepository,
    );

    // Ensure that the category is defined in the workspace
    const category = await ensureResourceExistsInWorkspace(
      "category",
      details.categoryId,
      details.workspaceId,
      categoryRepository,
    );

    const transaction = new Transaction(
      idGenerator.generate(),
      details.workspaceId,
      details.date,
      details.categoryId,
      details.amount,
      details.notes ?? "",
      details.documentationUrl ?? "",
    );

    await transactionRepository.createOne(transaction);

    return {
      id: transaction.id,
      date: transaction.date,
      workspaceId: transaction.workspaceId,
      amount: transaction.amount,
      category: {
        id: category.id,
        name: category.name,
      },
      notes: transaction.notes,
      documentationUrl: transaction.documentationUrl,
    };
  }
}
