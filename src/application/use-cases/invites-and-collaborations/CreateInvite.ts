import { InviteDTO } from "@application/dtos/InviteDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureActorHasNoExistingCollaboration } from "@application/guards/ensureNoExistingCollaborationsForUser";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { ensureActorHasNoExistingInvite } from "@application/guards/ensureActorHasNoExistingInvite";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";
import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { WorkspaceRepository } from "@application/ports/repositories/WorkspaceRepository";
import { Invite } from "@entities/Invite";
import { IDGenerator } from "@application/ports/services/IDGenerator";

const INVITE_EXPIRATION_MONTHS = 1;

interface CreateInviteDependencies {
  inviteRepository: InviteRepository;
  collaborationRepository: CollaborationRepository;
  workspaceRepository: WorkspaceRepository;
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
      idGenerator,
      workspaceRepository,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

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

    await ensureActorHasNoExistingCollaboration(
      actor,
      details.workspaceId,
      collaborationRepository,
    );

    await ensureActorHasNoExistingInvite(
      actor,
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

    return { ...invite };
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
