import { Actor } from "@entities/Actor";
import { UUID } from "node:crypto";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { Forbidden } from "@application/errors/Forbidden";

export async function ensureActorOwnsWorkspace(
    actor: Actor,
    workspaceId: UUID,
    operation: string,
    collaborationRepository: CollaborationRepository
) {
    const collaboration = await collaborationRepository.getOneByUserIdAndWorkspaceId(
        actor.id,
        workspaceId
    );

    if (!collaboration || collaboration.role !== "owner") {
        throw new Forbidden(actor.id, operation);
    }

    return collaboration;
}
