import { CollaborationRepository } from "@application/ports/repositories/CollaborationRepository";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { UUID } from "node:crypto";

export async function ensureUserHasNoExistingCollaboration(
  user: { id: UUID },
  workspaceId: UUID,
  collaborationRepository: CollaborationRepository,
) {
  const existingCollaboration =
    await collaborationRepository.getOneByUserIdAndWorkspaceId(
      user.id,
      workspaceId,
    );

  if (existingCollaboration) {
    throw new ResourceConflict(
      `The user (${user.id}) is already a collaborator in workspace (${workspaceId}).`,
    );
  }
}
