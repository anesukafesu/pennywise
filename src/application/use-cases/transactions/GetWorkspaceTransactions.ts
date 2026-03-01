import { TransactionDTO } from "@application/dtos/TransactionDTO";
import { Actor } from "@entities/Actor";
import { CategoryRepository } from "@application/ports/repositories/CategoryRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { TransactionRepository } from "@application/ports/repositories/TransactionRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { mapTransactionsToDTOs } from "@application/mappers/mapTransactionsToDTOs";
import { UUID } from "node:crypto";

interface GetWorkspaceTransactionsDependencies {
  workspaceRepository: WorkspaceRepository;
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
  collaborationRepository: CollaborationRepository;
}

interface GetWorkspaceTransactionsInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class GetWorkspaceTransactionsUseCase {
  constructor(
    private readonly dependencies: GetWorkspaceTransactionsDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: GetWorkspaceTransactionsInput): Promise<TransactionDTO[]> {
    const {
      workspaceRepository,
      transactionRepository,
      collaborationRepository,
      categoryRepository,
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
      "Get workspace transactions",
      collaborationRepository,
    );

    const transactions = await transactionRepository.getManyByWorkspaceId(
      details.workspaceId,
    );

    return await mapTransactionsToDTOs(transactions, categoryRepository);
  }
}
