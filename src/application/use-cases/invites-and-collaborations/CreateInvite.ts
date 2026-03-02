import { InviteDTO } from "@application/dtos/InviteDTO";
import { ensureUserHasNoExistingCollaboration } from "@application/guards/ensureUserHasNoExistingCollaboration";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureUserHasNoExistingInvite } from "@application/guards/ensureUserHasNoExistingInvite";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";
import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { Invite } from "@entities/Invite";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { createInviteDTOs } from "@application/mappers/createInviteDTOs";

const INVITE_EXPIRATION_MONTHS = 1;

interface CreateInviteDependencies {
  inviteRepository: InviteRepository;
  collaborationRepository: CollaborationRepository;
  workspaceRepository: WorkspaceRepository;
  userRepository: UserRepository;
  idGenerator: IDGenerator;
}

interface CreateInviteInput {
  actor: Actor;
  details: {
    workspaceId: UUID;
    inviteeId: UUID;
  };
}

export class CreateInviteUseCase {
  constructor(private readonly dependencies: CreateInviteDependencies) {}

  async execute({ actor, details }: CreateInviteInput): Promise<InviteDTO> {
    const {
      inviteRepository,
      collaborationRepository,
      userRepository,
      idGenerator,
      workspaceRepository,
    } = this.dependencies;

    await ensureResourceExists(
      "workspace",
      details.workspaceId,
      workspaceRepository,
    );

    await ensureActorOwnsWorkspace(
      actor,
      details.workspaceId,
      `Create invite for ${details.inviteeId} to workspace ${details.workspaceId}`,
      collaborationRepository,
    );

    const invitee = await ensureResourceExists(
      "user",
      details.inviteeId,
      userRepository,
    );

    await ensureUserHasNoExistingCollaboration(
      invitee,
      details.workspaceId,
      collaborationRepository,
    );

    await ensureUserHasNoExistingInvite(
      invitee,
      details.workspaceId,
      inviteRepository,
    );

    const invite = new Invite(
      idGenerator.generate(),
      details.inviteeId,
      details.workspaceId,
      this.createFutureDate(INVITE_EXPIRATION_MONTHS),
    );

    await inviteRepository.createOne(invite);

    const inviteDTO = createInviteDTOs([invite], [invitee])[0];

    return inviteDTO;
  }

  private createFutureDate(monthsBeforeExpiration: number) {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth() + monthsBeforeExpiration,
      now.getDate(),
    );
  }
}
