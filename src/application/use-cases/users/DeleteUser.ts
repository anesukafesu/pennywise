import { NotFound } from "@application/errors/NotFound";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { CredentialRepository } from "@application/ports/repositories/CredentialRepository";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { UserRepository } from "@application/ports/repositories/UserRepository";
import { TransactionRunner } from "@application/ports/services/TransactionRunner";
import { Actor } from "@entities/Actor";

interface DeleteUserDependencies {
  userRepository: UserRepository;
  collaborationRepository: CollaborationRepository;
  inviteRepository: InviteRepository;
  transactionRunner: TransactionRunner;
  credentialRepository: CredentialRepository;
}

interface DeleteUserInput {
  actor: Actor;
}

export class DeleteUserUseCase {
  constructor(private readonly dependencies: DeleteUserDependencies) {}

  async execute({ actor }: DeleteUserInput) {
    const {
      userRepository,
      collaborationRepository,
      transactionRunner,
      inviteRepository,
      credentialRepository,
    } = this.dependencies;

    const user = await userRepository.getOneById(actor.id);

    if (!user) {
      throw new NotFound("user", actor.id);
    }

    const userOwnsAnyWorkspace =
      await collaborationRepository.doesUserOwnWorkspaces(actor.id);

    if (userOwnsAnyWorkspace) {
      throw new InvalidInput("Cannot delete a user who owns a workspace.");
    }

    await transactionRunner.run(async (tx) => {
      await collaborationRepository.deleteManyByUserId(actor.id, tx);
      await inviteRepository.deleteManyByUserId(actor.id, tx);
      await credentialRepository.deleteManyByUserId(actor.id, tx);
      await userRepository.deleteOneById(actor.id, tx);
    });
  }
}
