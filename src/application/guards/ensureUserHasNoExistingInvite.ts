import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { UUID } from "node:crypto";

export async function ensureUserHasNoExistingInvite(
  user: { id: UUID },
  workspaceId: UUID,
  inviteRepository: InviteRepository,
) {
  const existingInvite = await inviteRepository.getOneByUserIdAndWorkspaceId(
    user.id,
    workspaceId,
  );

  if (existingInvite) {
    throw new ResourceConflict(
      `User already has an invite to: ${workspaceId}.`,
    );
  }
}
