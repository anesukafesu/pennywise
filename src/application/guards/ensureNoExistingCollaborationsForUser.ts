import { Actor } from "@entities/Actor";
import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { UUID } from "node:crypto";

export async function ensureActorHasNoExistingCollaboration(
    actor: Actor,
    workspaceId: UUID,
    collaborationRepository: CollaborationRepository
) {
   const existingCollaboration = await collaborationRepository
       .getOneByUserIdAndWorkspaceId(actor.id, workspaceId);

   if (existingCollaboration) {
       throw new ResourceConflict(
           `The user (${actor.id}) is already a collaborator in workspace (${workspaceId}).`
       );
   }
}