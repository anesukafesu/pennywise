import { NotFound } from "@application/errors/NotFound";
import { Resource } from "@domain/types/ResourceTypes";
import { UUID } from "node:crypto";

interface Repository<T> {
    getOneById(id: UUID): Promise<T | undefined>
}

export async function ensureResourceExists<T>(
    resourceType: Resource,
    resourceId: UUID,
    resourceRepository: Repository<T>,
): Promise<T> {
    const item = await resourceRepository.getOneById(resourceId);

    if (!item) {
        throw new NotFound(resourceType, resourceId)
    }

    return item;
}