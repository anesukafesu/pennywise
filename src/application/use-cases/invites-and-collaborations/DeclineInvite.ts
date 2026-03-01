import { Forbidden } from "@application/errors/Forbidden";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureResourceExists } from "@application/guards/ensureResourceExists";
import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";

interface DeclineInviteDependencies {
  inviteRepository: InviteRepository;
}

interface DeclineInviteInput {
  actor: Actor;
  details: {
    inviteId: UUID;
  };
}

export class DeclineInviteUseCase {
  constructor(private readonly dependencies: DeclineInviteDependencies) {}

  async execute({ actor, details }: DeclineInviteInput) {
    const { inviteRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const invite = await ensureResourceExists(
      "invite",
      details.inviteId,
      inviteRepository,
    );

    if (actor.id !== invite.userId) {
      throw new Forbidden(actor.id, `Decline invite (${actor.id}).`);
    }

    // Declining expired invites is fine.
    await this.dependencies.inviteRepository.deleteOneById(actor.id);
  }
}
