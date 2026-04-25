import { InviteDTO } from "@application/dtos/InviteDTO";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { createInviteDTOs } from "@application/mappers/createInviteDTOs";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { Actor } from "@domain/entities/Actor";

interface GetIncomingInvitesUseCaseDependencies {
  inviteRepository: InviteRepository;
  userRepository: UserRepository;
}

interface GetIncomingInvitesUseCaseInput {
  actor: Actor;
}

export class GetIncomingInvitesUseCase {
  constructor(
    private readonly dependencies: GetIncomingInvitesUseCaseDependencies,
  ) {}

  async execute({ actor }: GetIncomingInvitesUseCaseInput): Promise<InviteDTO[]> {
    const { inviteRepository, userRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const invites = await inviteRepository.getManyByUserId(actor.id);

    const users = await userRepository.getManyByIds(
      invites.map((invite) => invite.userId),
    );

    return createInviteDTOs(invites, users);
  }
}
