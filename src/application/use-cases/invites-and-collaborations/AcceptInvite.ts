import { Forbidden } from "@application/errors/Forbidden";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureInviteHasNotExpired } from "@application/guards/ensureInviteHasNotExpired";
import { ensureUserHasNoExistingCollaboration } from "@application/guards/ensureUserHasNoExistingCollaboration";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { Actor } from "@entities/Actor";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { IDGenerator } from "@application/ports/services/IDGenerator";
import { UUID } from "node:crypto";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { Collaboration } from "@entities/Collaboration";

interface AcceptInviteDependencies {
  inviteRepository: InviteRepository;
  collaborationRepository: CollaborationRepository;
  idGenerator: IDGenerator;
  transactionRunner: TransactionRunner;
}

interface AcceptInviteInput {
  actor: Actor;
  details: {
    inviteId: UUID;
  };
}

export class AcceptInviteUseCase {
  constructor(private readonly dependencies: AcceptInviteDependencies) {}

  async execute({ actor, details }: AcceptInviteInput): Promise<void> {
    const {
      inviteRepository,
      collaborationRepository,
      idGenerator,
      transactionRunner,
    } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const invite = await ensureResourceExists(
      "invite",
      details.inviteId,
      inviteRepository,
    );

    ensureInviteHasNotExpired(invite);

    if (invite.userId !== actor.id) {
      throw new Forbidden(actor.id, `Accept invite (${actor.id}).`);
    }

    await ensureUserHasNoExistingCollaboration(
      actor,
      invite.workspaceId,
      collaborationRepository,
    );

    const collaboration = new Collaboration(
      idGenerator.generate(),
      actor.id,
      invite.workspaceId,
      "collaborator",
      new Date(),
    );

    await transactionRunner.run(async (tx) => {
      await inviteRepository.deleteOneById(details.inviteId, tx);
      await collaborationRepository.createOne(collaboration, tx);
    });
  }
}
