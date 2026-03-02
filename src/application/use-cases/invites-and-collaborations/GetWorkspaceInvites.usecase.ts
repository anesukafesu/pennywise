import { InviteDTO } from "@application/dtos/InviteDTO";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";
import { createInviteDTOs } from "@application/mappers/createInviteDTOs";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { Actor } from "@domain/entities/Actor";
import { UUID } from "node:crypto";

export interface GetWorkspaceInvitesUseCaseDependencies {
  collaborationRepository: CollaborationRepository;
  inviteRepository: InviteRepository;
  userRepository: UserRepository;
}

export interface GetWorkspaceInvitesUseCaseInput {
  actor: Actor;
  data: {
    workspaceId: UUID;
  };
}

export class GetWorkspaceInvitesUseCase {
  constructor(private dependencies: GetWorkspaceInvitesUseCaseDependencies) {}

  async execute({
    actor,
    data: { workspaceId },
  }: GetWorkspaceInvitesUseCaseInput): Promise<InviteDTO[]> {
    const { collaborationRepository, inviteRepository, userRepository } =
      this.dependencies;

    ensureActorOwnsWorkspace(
      actor,
      workspaceId,
      "Get Workspace Invites.",
      collaborationRepository,
    );

    const invites = await inviteRepository.getManyByWorkspaceId(workspaceId);

    const users = await userRepository.getManyByIds(
      invites.map((invite) => invite.userId),
    );

    return createInviteDTOs(invites, users);
  }
}
