import { WorkspaceDTO } from "@application/dtos/WorkspaceDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { mapWorkspaceToDTO } from "@application/mappers/mapWorkspaceToDTO";
import { Actor } from "@entities/Actor";
import { Workspace } from "@entities/Workspace";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { Collaboration } from "@entities/Collaboration";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";

interface CreateWorkspaceDependencies {
  idGenerator: IDGenerator;
  transactionRunner: TransactionRunner;
  workspaceRepository: WorkspaceRepository;
  userRepository: UserRepository;
  collaborationRepository: CollaborationRepository;
}

interface CreateWorkspaceInput {
  actor: Actor;
  details: {
    name: string;
    description: string;
    currencyCode: string;
  };
}

export class CreateWorkspaceUseCase {
  private readonly dependencies: CreateWorkspaceDependencies;

  constructor(dependencies: CreateWorkspaceDependencies) {
    this.dependencies = dependencies;
  }

  async execute({
    actor,
    details,
  }: CreateWorkspaceInput): Promise<WorkspaceDTO> {
    const {
      idGenerator,
      transactionRunner,
      workspaceRepository,
      userRepository,
      collaborationRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    await ensureResourceExists("user", actor.id, userRepository);

    const now = new Date();

    const workspace = new Workspace(
      idGenerator.generate(),
      details.name,
      details.description,
      now,
      details.currencyCode,
    );

    const collaboration = new Collaboration(
      idGenerator.generate(),
      actor.id,
      workspace.id,
      "owner",
      now,
    );

    await transactionRunner.run(async (tx) => {
      await workspaceRepository.createOne(workspace, tx);
      await collaborationRepository.createOne(collaboration, tx);
    });

    return mapWorkspaceToDTO(workspace);
  }
}
