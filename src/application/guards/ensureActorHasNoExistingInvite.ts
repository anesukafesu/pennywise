import { Actor } from "@entities/Actor";
import { InviteRepository } from "@application/ports/repositories/InviteRepository";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { UUID } from "node:crypto";

export async function ensureActorHasNoExistingInvite(
    actor: Actor,
    workspaceId: UUID,
    inviteRepository: InviteRepository,
) {
    const existingInvite = await inviteRepository
        .getOneByUserIdAndWorkspaceId(actor.id, workspaceId);

    if (existingInvite) {
        throw new ResourceConflict(`User already has an invite to: ${workspaceId}.`);
    }
}