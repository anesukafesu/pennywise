import { ensureActorHasAccessToWorkspace } from "@application/guards/ensureActorHasAccessToWorkspace";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { CollaborationDTO } from "@application/dtos/CollaborationDTO";
import { createCollaborationDTOs } from "@application/mappers/createCollaborationDTOs";
import { Actor } from "@domain/entities/Actor";
import { UUID } from "node:crypto";

interface GetWorkspaceCollaborationsUseCaseDependencies {
  collaborationRepository: CollaborationRepository;
  userRepository: UserRepository;
}

interface GetWorkspaceCollaborationsUseCaseInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
  };
}

export class GetWorkspaceCollaborationsUseCase {
  constructor(
    private dependencies: GetWorkspaceCollaborationsUseCaseDependencies,
  ) {}

  async execute({
    actor,
    details,
  }: GetWorkspaceCollaborationsUseCaseInput): Promise<CollaborationDTO[]> {
    const { collaborationRepository, userRepository } = this.dependencies;

    ensureActorHasAccessToWorkspace(
      actor,
      details.workspaceId,
      "Get workspace collaborations",
      collaborationRepository,
    );

    const collaborations = await collaborationRepository.getManyByWorkspaceId(
      details.workspaceId,
    );

    const users = await userRepository.getManyByIds(
      collaborations.map((collaboration) => collaboration.userId),
    );

    return createCollaborationDTOs(collaborations, users);
  }
}
