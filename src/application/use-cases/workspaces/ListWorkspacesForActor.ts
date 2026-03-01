import { WorkspaceDTO } from "@application/dtos/WorkspaceDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { Actor } from "@entities/Actor";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";

interface ListWorkspacesForUserDependencies {
  workspaceRepository: WorkspaceRepository;
  collaborationRepository: CollaborationRepository;
}

interface ListWorkspacesForUserInput {
  actor: Actor;
}

export class ListWorkspacesForActorUseCase {
  private readonly dependencies: ListWorkspacesForUserDependencies;

  constructor(dependencies: ListWorkspacesForUserDependencies) {
    this.dependencies = dependencies;
  }

  async execute({
    actor,
  }: ListWorkspacesForUserInput): Promise<WorkspaceDTO[]> {
    const { collaborationRepository, workspaceRepository } = this.dependencies;
    ensureActorIsAuthenticated(actor);

    const collaborationsForUser = await collaborationRepository.getManyByUserId(
      actor.id,
    );

    const workspaceIds = collaborationsForUser.map((c) => c.workspaceId);

    if (workspaceIds.length === 0) {
      return [];
    }

    const workspaces = await workspaceRepository.getManyByIds(workspaceIds);
    return workspaces.map((workspace) => {
      return {
        ...workspace,
        dateCreated: workspace.dateCreated.toISOString(),
      };
    });
  }
}
