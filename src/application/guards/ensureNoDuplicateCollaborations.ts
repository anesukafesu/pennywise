import { Collaboration } from "@entities/Collaboration";
import { ResourceConflict } from "@application/errors/ResourceConflict";
import { UUID } from "node:crypto";

export function ensureNoDuplicateCollaborations(collaborations: Collaboration[], userId: UUID) {
    const workspaceIds = collaborations.map(c => c.workspaceId);
    const uniqueWorkspaceIds = [...new Set(workspaceIds)];

    if (workspaceIds.length != uniqueWorkspaceIds.length) {
        throw new ResourceConflict(
            `User (${userId}) has one or more collaborations in the same workspace.`
        );
    }

    return uniqueWorkspaceIds;
}