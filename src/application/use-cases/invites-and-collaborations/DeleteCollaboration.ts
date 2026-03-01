import { NotFound } from "@application/errors/NotFound";
import { ensureActorIsAuthenticated } from "@application/guards/ensureActorIsAuthenticated";
import { ensureActorOwnsWorkspace } from "@application/guards/ensureActorOwnsWorkspace";
import { Actor } from "@entities/Actor";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { UUID } from "node:crypto";

interface DeleteCollaborationDependencies {
  collaborationRepository: CollaborationRepository;
}

interface DeleteCollaborationInput {
  actor: Actor;
  details: {
    collaborationId: UUID;
  };
}

export class DeleteCollaborationUseCase {
  constructor(private readonly dependencies: DeleteCollaborationDependencies) {}

  async execute({ actor, details }: DeleteCollaborationInput) {
    const { collaborationRepository } = this.dependencies;

    ensureActorIsAuthenticated(actor);

    const collaboration = await collaborationRepository.getOneById(
      details.collaborationId,
    );

    if (!collaboration) {
      throw new NotFound("collaboration", details.collaborationId);
    }

    const { workspaceId } = collaboration;

    await ensureActorOwnsWorkspace(
      actor,
      workspaceId,
      `Delete collaboration ${details.collaborationId}`,
      collaborationRepository,
    );

    await collaborationRepository.deleteOneById(details.collaborationId);
  }
}
