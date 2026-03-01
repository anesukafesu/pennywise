import { NotFound } from "@application/errors/NotFound";
import { WorkspaceScopedResource, WorkspaceScopedResources } from "@domain/types/ResourceTypes";
import { UUID } from "node:crypto";

interface Repository <T extends WorkspaceScopedResource> {
    getOneById(id: UUID): Promise<T | undefined>
}

export async function ensureResourceExistsInWorkspace<T extends WorkspaceScopedResource>(
    resourceType: WorkspaceScopedResources,
    resourceId: UUID,
    workspaceId: UUID,
    resourceRepository: Repository<T>,
): Promise<T> {
    const resource = await resourceRepository.getOneById(resourceId);

    if (!resource || resource.workspaceId !== workspaceId) {
        throw new NotFound(resourceType, resourceId);
    }

    return resource;
}